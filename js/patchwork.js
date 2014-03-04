/*
 * Patchwork
 * http://tgolson.com/patchwork/
 *
 * v 1.0.0
 */

(function ( global, factory )  {

  global.Patchwork = factory( global );

}( this, function () {

  var $patchwork;
  var $parent;
  var $patches;
  var attrs =  {};


  /*
   * Initializer
   */
  function init () {
    definePatchwork();
    defineParent();
    checkForTargetSizeData();
    runSizingFunctions();
    setResizeListener()
  }


  /*
   * Define the patchwork area
   */
  function definePatchwork () {
    $patchwork = $('#patchwork');
    $patchwork.css('text-align', 'left');
  }


  /*
   * Define the parent of the patchwork
   */
  function defineParent () {
    $parent = $patchwork.parent();
    $parent.css('overflow', 'hidden');

    // Default to the window if none defined
    if ( $parent.html() == $('body').html() ) {
      $parent = $(window);
    }
  }


  /*
   * Check for user settings for target patch sizes
   * Default to 100px
   */
  function checkForTargetSizeData () {
    attrs.targetPatchSizeY = $patchwork.data().targetSizeX || 100;
    attrs.targetPatchSizeX = $patchwork.data().targetSizeY || 100;
  }


  /*
   * Start the process of shaping patches
   */
  function runSizingFunctions () {
    setAttrs();
    setPatchworkDimensions();
    insertPatches();
  }


  /*
   * Set patchwork attributes
   */
  function setAttrs () {

    // Set patchwork size to parent element size
    attrs.patchworkX = $parent.width();
    attrs.patchworkY = $parent.height();

    // Round down for patchCounts
    attrs.patchCountX = Math.floor( attrs.patchworkX / attrs.targetPatchSizeX );
    attrs.patchCountY = Math.floor( attrs.patchworkY / attrs.targetPatchSizeY );

    // Set minimum patches to one - zero would leave the screen blank
    attrs.patchCountX === 0 ? this.patchCountX = 1 : null;
    attrs.patchCountY === 0 ? this.patchCountY = 1 : null;

    var styleSets = $patchwork.data().styleSets;

    // Check if the number of style sets is a factor of the horizontal row count
    if ( attrs.patchCountX % styleSets === 0 ) {
      attrs.patchCountX += 1;
      attrs.patchCountY += 1;
    }

    // Set patch sizes
    attrs.patchSizeX = Math.floor( attrs.patchworkX / attrs.patchCountX );
    attrs.patchSizeY = Math.floor( attrs.patchworkY / attrs.patchCountY );

    // Calculate remainder pixels
    attrs.remainderX = attrs.patchworkX % attrs.patchCountX;
    attrs.remainderY = attrs.patchworkY % attrs.patchCountY;

    attrs.patchCountTotal = attrs.patchCountX * attrs.patchCountY;
  }


  /*
   * Set the dimensions of the patchwork
   */
  function setPatchworkDimensions () {
    $patchwork.width( $parent.width() );
    $patchwork.height( $parent.height() );
  }


  /*
   * Clear all patches and re-render
   */
  function insertPatches () {

    destroy();

    var eachRemainderY = Math.floor( attrs.patchCountY / attrs.remainderY )
    var remainderYUsed = 0

    for( var i = 0; i < attrs.patchCountY; i++ ) {

      var extraY = 0

      // Evenly distribute vertical remainder pixels among rows
      if( i % eachRemainderY == 0 && remainderYUsed < attrs.remainderY ){
        extraY = 1;
        remainderYUsed += 1;
      }

      var newRow = createRow( i, extraY );

      $patchwork.append( newRow );
    }
  }


  /*
   * Create rows of patches
   */
  function createRow( rowNum, extraY ){

    var eachRemainderX = Math.floor( attrs.patchCountX / attrs.remainderX )
    var remainderXUsed = 0
    var rowPatches = []

    for( var i = 0; i < attrs.patchCountX; i++ ) {

      var extraX = 0

      // Evenly distribute horizontal remainder pixels among columns
      if( i % eachRemainderX == 0 && remainderXUsed  < attrs.remainderX ){
        extraX = 1;
        remainderXUsed += 1;
      }

      var newPatch = createPatch( rowNum, i, extraX, extraY );

      rowPatches.push( newPatch )
    }

    return rowPatches
  }


  /*
   * Patch factory
   */
  function createPatch ( rowNum, patchNum, extraX, extraY ) {

    var globalPatchNum = rowNum * attrs.patchCountX + patchNum

    var newPatch = $('<div>')
      .attr('id', 'patch' + globalPatchNum )
      .attr('class', 'patch row' + rowNum )
      .css('width', attrs.patchSizeX + extraX )
      .css('height', attrs.patchSizeY + extraY )
      .css('display', 'inline-block');

    // Add span with a text element to fix inline white-space
    var span = $('<span>')
      .attr('class', 'white-space-remover')
      .css('visibility', 'hidden')
      .css('font-size', '0px')
      .html('.');

    return newPatch.html(span);
  }


  /*
   * Listen for screen resize
   */
  function setResizeListener () {
    var runResize;

    $(window).on('touchstart', function () {

      clearTimeout(runResize);

      // Only refresh after 25ms timeout
      // This prevents many unnecessary refreshes while resizing
      var runResize = setTimeout( refresh, 25 );

    });

    $(window).resize( function () {

      clearTimeout(runResize);

      // Only refresh after 25ms timeout
      // This prevents many unnecessary refreshes while resizing
      var runResize = setTimeout( refresh, 25 );
    });
  }


  /*
   * Setter function
   */
  function set ( property, newValue ) {

    if ( attrs[property] === undefined ) {
      throw 'Unknown property - ' + property;
    } else if ( newValue === undefined ) {
      throw 'Missing value for ' + property;
    }

    attrs[property] = newValue;
    refresh();
  }


  /*
   * Getter function
   */
  function get ( property ) {

    if ( attrs[property] === undefined ) {
      return attrs;
    } else {
      return attrs[property];
    }
  }


  /*
   * Refresh the patchwork to current conditions
   */
  function refresh () {
    runSizingFunctions()
  }


  /*
   * Clear patchwork of all patches
   */
  function destroy () {
    $patchwork.empty();
  }

  return  {
    /*
     * Init and destroy
     */
    init: init,
    destroy: destroy,

    /*
     * Refresh patchwork
     */
    refresh: refresh,

    /*
     * Getter and setter
     */
    get: get,
    set: set,
  };

}));

$(function () {
  Patchwork.init();
});

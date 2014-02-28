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
    $(window).resize( refresh );
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
    // Store the previous patch count for later comparisons
    var prevPatchCount = attrs.patchCountTotal;

    setAttrs();
    setPatchworkDimensions();
    choosePatchFunction( prevPatchCount );
  }


  /*
   * Set patchwork attributes
   */
  function setAttrs () {

    attrs.patchworkX = $parent.width();
    attrs.patchworkY = $parent.height();

    // Round down for patchCounts
    attrs.patchCountX = Math.floor( attrs.patchworkX / attrs.targetPatchSizeX );
    attrs.patchCountY = Math.floor( attrs.patchworkY / attrs.targetPatchSizeY );

    // Set minimum patches to one - zero would leave the screen blank
    attrs.patchCountX === 0 ? this.patchCountX = 1 : null;
    attrs.patchCountY === 0 ? this.patchCountY = 1 : null;

    var styleSets = $patchwork.data().styleSets;

    // Check if the number of stylesets is a factor of the horizontal row count
    // If it is, the patches would align in an ugly way
    if ( attrs.patchCountX % styleSets === 0 ) {
      attrs.patchCountX += 1;
      attrs.patchCountY += 1;
    }

    attrs.patchSizeX = attrs.patchworkX / attrs.patchCountX;
    attrs.patchSizeY = attrs.patchworkY / attrs.patchCountY;

    // Try to find a patchCount that is a factor of the total patchwork dimensions
    if ( this.patchSizeY % 1 !== 0 ) {
      var nearestInt = ( function ( num, div ) {

        for ( var i = 0; i < div * 0.2; i++ ) {

          if (num % (div - i) == 0) {
            return div - i;
          }

          if (num % (div + i) == 0) {
            return div + i;
          }
        }

        return 0
      })( attrs.patchworkY, attrs.patchCountY );
    }

    // If there was no no factor close to the original count, just round up
    if (nearestInt != 0) {
      attrs.patchCountY = nearestInt;
      attrs.patchSizeY  = attrs.patchworkY / attrs.patchCountY;
    } else  {
      attrs.patchSizeY = Math.ceil( attrs.patchSizeY );
    }

    attrs.patchCountTotal = attrs.patchCountX * attrs.patchCountY;
  }


  /*
   * Set the dimensions of the patchwork
   */
  function setPatchworkDimensions () {
    $patchwork.width( Math.ceil( attrs.patchSizeX ) * attrs.patchCountX );
    $patchwork.height( attrs.patchSizeY * attrs.patchCountY );
  }


  /*
   * Decide which updating function will work
   * Either update sizes, or re-render all patches
   */
  function choosePatchFunction ( prevPatchCount ) {

    if ( prevPatchCount == attrs.patchCountTotal && $patches !== undefined ) {
      updatePatchSizes();
    } else {
      insertPatches();
    }
  }


  /*
   * Update existing patch sizes
   */
  function updatePatchSizes () {
    $patches.width(attrs.patchSizeX);
    $patches.height(attrs.patchSizeY);
  }


  /*
   * Clear all patches and re-render
   */
  function insertPatches () {

    destroy();

    for( var i = 0; i < attrs.patchCountTotal; i++ ) {
      var newPatch = createPatch( i );
      $patchwork.append( newPatch );
    }

    $patches = $('.patch')
  }


  /*
   * Patch factory
   */
  function createPatch ( patchNum ) {
    var newPatch = $('<div>')
      .attr('id', 'patch' + patchNum)
      .attr('class', 'patch')
      .css('width', attrs.patchSizeX)
      .css('height', attrs.patchSizeY)
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

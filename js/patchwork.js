(function (global, factory)  {

  global.Patchwork = factory(global);

}( this, function() {

  var $patchwork;

  var $parent;

  var attrs =  {};

  function init() {
    definePatchwork();
    setParent();
    checkForTargetSizeData();
    runSizingFunctions();
    $(window).resize( refresh );
  }

  function definePatchwork() {
    $patchwork = $('#patchwork');
    $patchwork.css('text-align', 'left');
  }

  function setParent() {
    $parent = $patchwork.parent();
    $parent.css('overflow', 'hidden');

    if ( $parent.html() == $('body').html() ) {
      $parent = $(window);
    }

  }

  function checkForTargetSizeData() {
    attrs.targetPatchSizeY = $patchwork.data().targetSizeX || 100;
    attrs.targetPatchSizeX = $patchwork.data().targetSizeY || 100;
  }

  function runSizingFunctions() {
    var prevPatchCount = attrs.patchCountTotal;

    setAttrs();
    setPatchworkDimensions();
    choosePatchFunction( prevPatchCount );
  }

  function setAttrs() {

    attrs.patchworkX = $parent.width();
    attrs.patchworkY = $parent.height();

    attrs.patchCountX = Math.floor( attrs.patchworkX / attrs.targetPatchSizeX );
    attrs.patchCountY = Math.floor( attrs.patchworkY / attrs.targetPatchSizeY );

    attrs.patchCountX === 0 ? this.patchCountX = 1 : null;
    attrs.patchCountY === 0 ? this.patchCountY = 1 : null;

    var styleSets = $patchwork.data().styleSets;

    if ( attrs.patchCountX % styleSets === 0 ) {
      attrs.patchCountX += 1;
      attrs.patchCountY += 1;
    }

    attrs.patchSizeX = attrs.patchworkX / attrs.patchCountX;
    attrs.patchSizeY = attrs.patchworkY / attrs.patchCountY;

    if ( this.patchSizeY % 1 !== 0 ) {
      var nearestInt = (function(num, div) {

        for ( var i = 0; i < div * 0.2; i++ ) {

          if (num % (div - i) == 0) {
            return div - i;
          }

          if (num % (div + i) == 0) {
            return div + i;
          }
        }

        return 0
      }( attrs.patchworkY, attrs.patchCountY ));
    }

    if (nearestInt != 0) {
      attrs.patchCountY = nearestInt;
      attrs.patchSizeY  = attrs.patchworkY / attrs.patchCountY;
    } else  {
      attrs.patchSizeY = Math.ceil( attrs.patchSizeY );
    }

    attrs.patchCountTotal = attrs.patchCountX * attrs.patchCountY;
  }

  function setPatchworkDimensions() {
    $patchwork.width( Math.ceil( attrs.patchSizeX ) * attrs.patchCountX );
    $patchwork.height( attrs.patchSizeY * attrs.patchCountY );
  }

  function choosePatchFunction( prevPatchCount ) {

    if ( prevPatchCount == attrs.patchCountTotal ) {
      updatePatchSizes();
    } else {
      insertPatches();
    }
  }

  function updatePatchSizes() {
    var $patches = $('.patch');

    $patches.width(attrs.patchSizeX);
    $patches.height(attrs.patchSizeY);
  }

  function insertPatches() {
    destroy();

    for( var i = 0; i < attrs.patchCountTotal; i++ ) {
      var newPatch = createPatch( i );
      $patchwork.append( newPatch );
    }
  }

  function createPatch( patchNum ) {
    var newPatch = $('<div>')
      .attr('id', 'patch' + patchNum)
      .attr('class', 'patch')
      .css('width', attrs.patchSizeX)
      .css('height', attrs.patchSizeY)
      .css('display', 'inline-block')

    var span = $('<span class="white-space-remover">')
      .css('visibility', 'hidden')
      .css('font-size', '0px')
      .html('.')

    return newPatch.html(span)
  }

  function set(property, newValue) {

    if ( attrs[property] === undefined ) {
      throw 'Unknown property - ' + property;
    } else if ( newValue === undefined ) {
      throw 'Missing value for ' + property;
    }

    attrs[property] = newValue;
    refresh();
  }

  function get(property) {

    if ( attrs[property] === undefined ) {
      return attrs;
    } else {
      return attrs[property]
    }
  }

  function refresh() {
    runSizingFunctions()
  }

  function destroy() {
    $patchwork.empty();
  }

  return  {
    init: init,
    get: get,
    set: set,
    refresh: refresh,
    destroy: destroy
  }
}))

$(function() {
  Patchwork.init()
})

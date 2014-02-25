$(function(){
  Patchwork.init()
  var self = Patchwork;
  $(window).resize( Patchwork.init.bind(self) );
  // $(window).resize( function(){ setTimeout( Patchwork.init.bind(self), 500) } );
})

var Patchwork = {
  $patchwork: null,
  $parent:    null,
  dimensions: { X: null, Y: null },
  patchSize:  { X: null, Y: null },
  patchCount: { X: null, Y: null, total: null },

  // set targetPatchSize to target a goal size for patches
  targetPatchSize: {
    X: 100,
    Y: 100
  },

  init: function(){
    this.$patchwork = $('#patchwork')
    this.setParent()
    this.checkForTargetSizeData()
    this.calculateProperties()
    this.setPatchworkDimensions()
    this.insertPatches()
  },

  setParent: function(){
    this.$parent = this.$patchwork.parent()
    this.$parent.css('overflow', 'hidden')
    if( this.$parent.html() == $('body').html() ){ this.$parent = $(window) }
  },

  checkForTargetSizeData: function(){
    this.targetPatchSize.X = this.$patchwork.data().targetSizeX || this.targetPatchSize.X
    this.targetPatchSize.Y = this.$patchwork.data().targetSizeY || this.targetPatchSize.Y
  },

  calculateProperties: function(){
    this.dimensions.X     = this.$parent.width()
    this.dimensions.Y     = this.$parent.height()
    this.patchCount.X     = Math.floor(this.dimensions.X / this.targetPatchSize.X)
    this.patchCount.Y     = Math.floor(this.dimensions.Y / this.targetPatchSize.Y)
    this.patchSize.X      = this.dimensions.X / this.patchCount.X
    this.patchSize.Y      = this.dimensions.Y / this.patchCount.Y
    this.patchCount.total = this.patchCount.X * this.patchCount.Y
  },

  setPatchworkDimensions: function(){
    this.$patchwork.width(this.dimensions.X)
    this.$patchwork.height(this.dimensions.Y)
  },

  insertPatches: function(){
    this.$patchwork.empty()
    for(var i = 0; i < this.patchCount.total; i++){
      var newPatch = this.createPatch(i)
      this.$patchwork.append(newPatch)
    }
  },

  createPatch: function(patchNum){
    return '<div id="patch'+ patchNum +
      '" class="patch" style="width:'+ this.patchSize.X +
      'px; height:'+ this.patchSize.Y +
      'px; display:inline-block;"><span class="white-space-remover" style="font-size:0px;visibility:hidden">.</span></div>'
  }
}

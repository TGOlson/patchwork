var Patchwork = {
  $patchwork: null,
  $parent:    null,
  dimensions: {
    X: null,
    Y: null
  },
  patchSize:  {
    X: null,
    Y: null
  },
  patchCount: {
    X: null,
    Y: null,
    total: null
  },
  targetPatchSize: {
    X: 100,
    Y: 100
  },

  init: function(){
    this.$patchwork = $('#patchwork')
    this.setParent()
    this.checkForTargetSizeData()
    this.runSizingFunctions()
    var self = this;
    $(window).resize( Patchwork.runSizingFunctions.bind(self) );
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

  runSizingFunctions: function(){
    var prevPatchCount = this.patchCount.total
    this.calculateProperties()
    this.setPatchworkDimensions()
    this.choosePatchFunction(prevPatchCount)
  },

  calculateProperties: function(){
    this.dimensions.X     = this.$parent.width()
    this.dimensions.Y     = this.$parent.height()
    this.patchCount.X     = Math.floor(this.dimensions.X / this.targetPatchSize.X)
    this.patchCount.Y     = Math.floor(this.dimensions.Y / this.targetPatchSize.Y)
    this.checkIfPatchCountIsZero()
    this.checkPatchCountAgainstStyleSets()
    this.patchSize.X      = this.dimensions.X / this.patchCount.X
    this.patchSize.Y      = this.dimensions.Y / this.patchCount.Y
    this.checkHeightForDecimalPixels()
    this.patchCount.total = this.patchCount.X * this.patchCount.Y
  },

  checkIfPatchCountIsZero: function(){
    if(this.patchCount.X === 0){ this.patchCount.X = 1}
    if(this.patchCount.Y === 0){ this.patchCount.Y = 1}
  },

  checkPatchCountAgainstStyleSets: function(){
    var styleSets = this.$patchwork.data().styleSets
    if(this.patchCount.X % styleSets == 0 ){ this.patchCount.X += 1; this.patchCount.Y += 1 }
  },

  checkHeightForDecimalPixels: function(){
    if(this.patchSize.Y != parseInt(this.patchSize.Y)){
      var nearestInt = this.findNearestInt(this.dimensions.Y, this.patchCount.Y)
      if(nearestInt != 0){
        console.log('using nearestInt')
        this.setHeightByNearestInt(nearestInt)
      } else {
        this.setHeightByRoundUp()
      }
    }
  },

  findNearestInt: function(num, div){
    for(var i = 0; i < div * 0.2; i++){
      if(num % (div - i) == 0){return div - i}
      if(num % (div + i) == 0){return div + i}
    }
    return 0
  },

  setHeightByNearestInt: function(nearestInt){
    this.patchCount.Y = nearestInt
    this.patchSize.Y  = this.dimensions.Y / this.patchCount.Y
  },

  setHeightByRoundUp: function(){
    this.patchSize.Y = Math.ceil(this.patchSize.Y)
  },

  setPatchworkDimensions: function(){
    this.$patchwork.width(this.dimensions.X)
    this.$patchwork.height(this.dimensions.Y)
  },

  choosePatchFunction: function(prevPatchCount){
    if(prevPatchCount == this.patchCount.total){
      this.updatePatchSizes()
    } else {
      this.insertPatches()
    }
  },

  updatePatchSizes: function(){
    var $patches = $('.patch')
    $patches.width(this.patchSize.X)
    $patches.height(this.patchSize.Y)
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
      'px; display:inline-block;"><span class="white-space-remover"' +
      'style="font-size:0px;visibility:hidden">.</span></div>'
  }
}

$(function(){
  Patchwork.init()
})

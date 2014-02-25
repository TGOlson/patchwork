# Patchwork

A simple framework for creating a fully responsive and dynamic media grid in the browser.

## What's that mean?

Standard responsive grids are great for lots of things, but what if you want to cover an entire area in a grid? What if that grid needs to hold its form as the viewport size changes? Most responsive grids will elongate elements, but in a media layout more elements may need to be added. That's where Patchwork comes in.

## Get Started

Simply import the JavaScript:

```
stylesheet
```

Then add the ```patchwork``` id to a div.

```html
<div id='patchwork'></div>
```

And boom - Patchwork. Depending on your setting, you might get something like this:

```html
<div id="patchwork" style="width: 1301px; height: 411px;">
  <div id="patch0" class="patch" style="width:216.83333333333334px; height:205.5px; display:inline-block;">
    <span class="white-space-remover" style="font-size:0px;visibility:hidden">.</span>
  </div>
  <div id="patch1" class="patch" style="width:216.83333333333334px; height:205.5px; display:inline-block;">
    ...
  </div>

    ...

  <div id="patch11" class="patch" style="width:216.83333333333334px; height:205.5px; display:inline-block;">
    ...
  </div>
</div>
```

## Patchwork is smart

Patchwork is useful because it takes a lot of worry out of the developer's hands. First, it looks for the ```div``` element with ```id='patchwork'```, then it assesses the parent element to see if it's being put into a wrapper. Then it looks at the desired patch sizes, and runs a calculation based on the current screen size to come up with patch sizes that will fill the entire screen with no remainder, while to staying close to the desired size.

Oh ya, and it refreshes the calculations on screen resize. So what was once a 6 x 3 grid may change to a 3 x 3 grid if the browser if scaled or zoomed.

**Parent Elements**

One of the most useful things about Patchwork is that is can easily be wrapped inside a parent element. For example, say you have a 400px by 300px area you want to put Patchwork into. Simple:

```html
  <div style="width:400px;height:300px;">
    <div id='patchwork'></div>
  </div>
```

Patchwork will look up at the parent element, and create itself with those dimensions, inside the parent element.

What if you don't place it into a wrapper ```div```? Then Patchwork will default it's parent to the entire ```body``` element, taking up the full window. In many cases this is likely the desired outcome.

## Customization

Currently Patchwork is designed to be quick and simple, so not too many customizations are built in. In the future, a suite of quick addons will be released under the Patchwork Toolbox. That being said, here are a few ways to change the experience:

**Change the target patch size**

Patchwork scales based on a desired size for the patches. These can be set in the ```patchwork.js``` file, or via data-attributes, which are recommended if importing the JavaScript externally.

Changing in the JavaScript file:

```javascript
var Patchwork = {
  ...
  targetPatchSize: {
    X: 200,
    Y: 200
  },
  ...
}
```

Or, setting via data-attributes:

```
set
```

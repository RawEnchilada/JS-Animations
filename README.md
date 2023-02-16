# Basic Scroll Animations

This is a small and simple library for creating scroll animations, inspired by ScrollMagic.

## Installation
    
```bash
npm install basic-scroll-animations
```

## Usage

```javascript
import { updateOnScroll } from 'basic-scroll-animations';

updateOnScroll('.myElement(s)')
    .from(0,{opacity:0})
    .to(1,{opacity:1})
    .using({easing:'easeInOut'});
```

## API

<br/>

### <b>Entry point: updateOnScroll(selector)</b>
Registers selected element(s) to be updated on scroll using the returned <b>Animation</b> object.<br/>

| Param | Type | Description |
| --- | --- | --- |
|selector | String | CSS selector for the element(s) to be updated on scroll. |

**Returns**: <b>Animation</b>

<br/><br/>

### <b>Position calculation functions:</b>

<b>elementTop(selector)</b>
Returns the top position of the element(s) relative to the document in scroll percentage.

<b>elementBottom(selector)</b>
Returns the bottom position of the element(s) relative to the document in scroll percentage.

<b>elementHeight(selector)</b>
Returns the height of the element(s) in scroll percentage.

> Note: if the selector matches multiple elements, the functions will return the data of the first element.<br/>

It is recommended to use these functions to calculate the position of the element(s) on scroll.</br>
Example:
```javascript
const start = elementBottom('.myElement(s)');
const finish = elementBottom('.myElement(s)') + elementHeight('.myElement(s)');

updateOnScroll('.myElement(s)')
    .from(start,{opacity:0})
    .to(finish,{opacity:1});
```


<br/><br/>

### <b>Animation</b>
The <b>Animation</b> object is returned by the entry point functions and is used to define the animation for the element(s) registered with it.<br/>
The <b>from</b> and <b>to</b> functions are used to define the 2 styles that will be used to interpolate the element(s) style on scroll.<br/>
<b>!Should only be initalized by an entry function.</b>

<b>from</b><br/>
Sets the initial style of the element(s). 

| Param | Type | Description |
| --- | --- | --- |
|percent | Number | The percentage (between 0 and 1) at which the element(s) should start being animated. |
|style | Style | The starting style to be applied to the element(s). |

**Returns**: <b>Animation</b>

<br/><br/>

<b>to</b><br/>
Sets the final style of the element(s).

| Param | Type | Description |
| --- | --- | --- |
|percent | Number | The percentage (between 0 and 1) at which the element(s) should be fully animated. |
|style | Style | The final style to be applied to the element(s). |

**Returns**: <b>Animation</b>

<br/><br/>

<b>using</b><br/>
Sets the interpolation function to be used to interpolate the element(s) style on scroll.

| Param | Type | Description |
| --- | --- | --- |
| options | Options | The options to be used to interpolate the element(s) style on scroll. |

**Returns**: <b>Animation</b>

<br/><br/>

###  <b>Style</b>
The <b>Style</b> object is used to define the style of the element(s) to be animated.<br/>
The <b>Style</b> object currently supports the following properties:<br/>

| Property | Type | Values | Description |
| --- | --- | --- | --- |
| opacity | Number | 0-1 | The opacity of the element(s). |
| translateX | Number | any | The X translation of the element(s). |
| translateY | Number | any | The Y translation of the element(s). |
| scaleX | Number | any | The X scale of the element(s). |
| scaleY | Number | any | The Y scale of the element(s). |

<br/><br/>

###  <b>Options</b>
The <b>Options</b> object is used to define the behaviour of the animation.<br/>
The <b>Options</b> object currently supports the following properties:<br/>

| Property | Type | Values | Description |
| --- | --- | --- | --- |
| easing | String | linear<br/>easeIn<br/>easeOut<br/>easeInOut | The easing function to be used to interpolate the element(s) style on scroll. |


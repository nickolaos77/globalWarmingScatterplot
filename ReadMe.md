This is a simple scatterplot using the D3.js library.

D3 Notes

1. In this project I used the attr() and style() methods and not the
attrs() and styles() method to avoid making an extra call to the server
for this seperate d3 library (3-selection-multi)

2. Hovering over a circle fires the appearance of tooltip.
To create this tooltip I created a group element (gCont) on which I appended
a rectangle (tooltip). Then on each mouseover a circle the function fired
changed the opacity of the rectangle from 0 to 1 while it also created
the 3 texts and appended them to the group element (gCont).
On mouseout the function triggered removed the texts and changed the opacity
of the rectangle from 1 to 0.
# LaTTe

LaTTe (Latex To Text) is a Google slides add-on to convert LaTeX math equation into a plain text. 
The plain text is styled with specific fonts and sizes, to mimic the LaTeX equation as much as possible.

The motivation of this project is that Google slides does not support math equations, 
and the existing add-ons all convert LaTeX equation commands into images. 
However, a beautifully styled equation can actually be achieved by choosing proper font, size and italic
with plain text. 

The idea is to 
1. Map LaTeX commands into unicode
2. Set up different fonts and sizes for different unicodes.

This gives the birth of this project. And the code is adapted from 
[MathEquation](https://github.com/brendena/MathEquationsGoogleSlide) (for app interface)
and [Unicodeit](https://github.com/svenkreiss/unicodeit) (for mapping LaTeX to unicode).

## Example

![](https://github.com/YuuuXie/LaTTe/blob/main/example.png?raw=true)

## Instructions

### Add a new equation
1. Type the LaTeX command into the input box, and click "Add to slide". 
2. Then a text box will be created in the slide with the equation. 
3. You can adjust the font, size and color as you want, and copy the text to your paragraph.

### Modify the existing equation
- Method 1: you can edit the plain text directly.

- Method 2: use tools like [Mathpix](https://mathpix.com) to convert the plain text equation into LaTeX command.

- Method 3: using "Connect to Equation" to get the original LaTeX command, and modify the LaTeX command.
    
    *Note: If you have copied the equation from one text box into another text box, then this method won't work.
To enable the "connect" method, you have to keep the original text box that the equation is created.*

1. Select the text box
2. Click "Connect to Equation", after a second, your original input LaTeX command will appear in the input box
3. You can modify the LaTeX command in the input box
4. Click "Add to slide", the equation in the text box will be altered into the new equation
5. Click "Disconnect from Equation", to dettach the equation.

## Limitations & Todos

- Some common commands are not supported, such as `\exp`, `\sin`, which we can use `\mathrm` as a workaround, but not ideal.
- `\mathrm{abc}` does not work. Need to do `\mathrm{a}\mathrm{b}\mathrm{c}`, same for `\mathbb{}` and `\mathbf{}`
- Support `\frac{}{}` and beautiful `\int` for an equation (need to use three rows for the one-line equation)
- The super/subscript of a super/subscript is not supported. Since Google slides does not support multi-level super/subscript, 
    this can be realized by using super/subscript symbols in unicode.
- Multi-line equations (using `\begin{align}` and `\begin{eqarray}`) are not supported.
- Matrices are not supported.

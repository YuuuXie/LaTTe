## LaTTe

LaTTe (Latex To Text) is a Google slides add-on to convert LaTeX math equation into a plain text. The plain text is styled with specific fonts and sizes, to mimic the LaTeX equation as much as possible.

The motivation of this project is that Google slides does not support math equations, and the existing add-ons all convert LaTeX equation commands into images. However, a beautifully styled equation can actually be achieved by choosing proper font, size and italic with plain text.

The idea is to

Map LaTeX commands into unicode
Set up different fonts and sizes for different unicodes.
This gives the birth of this project. And the code is adapted from MathEquation (for app interface) and Unicodeit (for mapping LaTeX to unicode).

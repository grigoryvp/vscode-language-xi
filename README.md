# Xi personal wiki language

"Xi" is a markdown-like language designed for a personal knowledge base.
Color and indentation is used to highlight headers, paragraphs, links,
source code examples and definitions. You can read and write Xi from
within a VSCode without a need to "render" it into a "visual" web page
or PDF. This makes Xi a very **fast** tool to keep records: you grep
someting, skim through Xi pages, add or change some text from within a same
editor, without a need to switch between 'edit' and 'previes' modes. An
example of Xi page from my personal knowledge base with "Memory" color theme:

<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/xi_illustration.png" height="256">

Example below shows a simple markdown syntax with nested headers and
paragraphs. With Xi, header is marked with indentation and tail space-dot
instead of indentation. So, header 2 in markdown that is '## Header 2'
becomes '  Header 2 .' in Xi (tail space-dot defines that it's a header
and leading two spaces defines second level. Third level will be 4 spaces
and up to 10 spaces for a maximum nesting level 5). Paragraphs are marked
with dot-space, effectively saving one empty line used in markdown:

<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/md_to_xi_src.png" width="256">
<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/md_to_xi_dst.png" width="256">

# Todo

* Better jumps, "[python syntax#scope]" should jump to "Scope .", "Scope[] ."
  etc, but not "scope" in plain text.
* Support for "header-as-link" link detection and jumps:
  * "NSButton[] ."
  * "[cocoa appkit] NSStatusBarButton[] ."
  * "NSStatusBarButton[] [cocoa appkit] ."
* Need to somehow implement deep links like "ruby api#Kernel#system" where
  "system" is a nested header under "Kernel".

# License

The following licensing applies to Xi personal wiki language:
Attribution-NonCommercial-NoDerivatives 4.0 International
(CC BY-NC-ND 4.0). For more information go to
https://creativecommons.org/licenses/by-nc-nd/4.0/

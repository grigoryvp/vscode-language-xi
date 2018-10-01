# Xi personal wiki language

"Xi" is a markdown-like language designed for a personal knowledge base.
Color and indentation is used to highlight headings, paragraphs, links,
source code examples and definitions. You can read and write Xi from
within a VSCode without a need to "render" it into a "visual" web page
or PDF. This makes Xi a very **fast** tool to keep records: you grep
someting, skim through Xi pages, add or change some text from within a same
editor, without a need to switch between 'edit' and 'previes' modes. An
example of Xi page from my personal knowledge base with "Memory" color theme:

<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/xi_illustration.png" height="256">

Example below shows a simple markdown syntax with nested headings and
paragraphs. With Xi, heading is marked with indentation and tail space-dot
instead of indentation. So, heading 2 in markdown that is '## Heading 2'
becomes '  Heading 2 .' in Xi (tail space-dot defines that it's a heading
and leading two spaces defines second level. Third level will be 4 spaces
and up to 10 spaces for a maximum nesting level 5). Paragraphs are marked
with dot-space, effectively saving one empty line used in markdown:

<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/md_to_xi_src.png" width="256">
<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/md_to_xi_dst.png" width="256">

## Paragraph

Simplest building block of a knowledge base, first paragraph line is prefixed
with dot-and-space, while each next line is prefixed with two spaces.
Paragraph itself can be indented with increments of two spaces in order to
nest under different heading or other paragraphs. Compared to markdown
notion of separating paragraphs with empty line, such layout saves a lot
of vertical space, which is vital for documenting software-related things
like programming lanugae syntax, APIs, frameworks etc. We tend to have
short paragraphs that do not tend to follow each other, but tend to form
a really complex nested strucure with lots of headings, meta information,
code samples etc. Such paragrpah layout, used alongside colored headings and
proper indentation, proved it's worth during my 10 years of using Xi as a
personal knowledge base.

<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/paragraph_1.png" width="256">

## Heading

Alongside paragraph, heading is a second most used building block for a
knowledge base. Heading type is denoted by space-dot suffix, while heading
nesting level is denoted by increments of two spaces. In most cases headings
are combined with paragraphs in order to create hierarchical structures
that are easy to read **and modify**.

<img src="https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/heading_1.png" width="256">

## Links

Here Xi starts to differenciate from Markdown. Simple "wikiword" link looks
like one in Markdown, `[foo]`, but clicking on such link will try to open
corresponding file, so everything works locally within VSCode. File name
is created by lowercasing text between square braces, replacing spaces with
underscores and appending `.xi` suffix. So clicking on the `[foo]` wikiword
will instruct VSCode to open `foo.xi` in same folder, or ask to create one
if it does not exist.

<!--- 250px 120px -->
![wikiword link](https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/link_1.png)

Wikiword links with anchors extend this concept by allowing to add heading
name after `#`. Clicking on the like like `[js api#search]` will try to
open `js_api.xi` file and scroll to the first `search` hading (that starts
with spaces and ends with space-dot).

Header links transforms a header into link by adding `[] .` instead of
space-and-dot. Mostly useful while describing APIs or frameworks with
complex tree structures where some headers points to articles of their own.
Header can also start and/or end with wikiword links.

<!--- 450px 120px -->
![wikiword link](https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/link_2.png)

Anchor links starts with `#` and jumps within same document (mostly used for
"Reference" section at bottom). Anchor target is specified by placing
`#` as a last symbol of a wikiword link, so clicking on the link `[#1]`
will jump into a line with `[1#]` anchor.

<!--- 840px 120px -->
![wikiword link](https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/link_3.png)

## Text highlight

Xi supports a number of ways to highligh important parts of text. Pipes are
used to highlight "special text" which are terms, API method names etc.
Backticks are used to highlight something important with bright color. Please
note that if [memory color theme](https://marketplace.visualstudio.com/items?itemName=grigoryvp.memory-theme)
is used, highlight syntax is dimmed:

<!--- 600px 40px -->
![text highlight](https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/highlight.png)

## Code samples

Xi was created with main goal to keep all my notes about different
programming languages, framework and APIs I use. It is tailored to
represent code samples in multiple ways. Most common is "block code sample"
which is a paragraph (dot-space prefix) that starts with a pipe
character, followed by meta information inside curly braces. Meta
syntax is a list of key-value pairs, key separated from value with colon
and pairs separated from each over with semicolon. I use 'lng' key to
denote programming language type and file extension as a value. So the
block code sample for a Python programming language will start with
`. |{lng:py}`, which will be dimmed out by a syntax highlighter. Each line
of the sample is prefixed with a pipe, indented to match the position of
the pipe in the `|{lng:py}`:

<!--- 280px 60px -->
![text highlight](https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/code_1.png)

Code sample can be a paragraph of it's own or appear as a part of paragraph
with text:

<!--- 280px 90px -->
![text highlight](https://raw.githubusercontent.com/grigoryvp/vscode-language-xi/master/doc/code_2.png)

## Todo

* Correctly catch links within special marks, ex |https://foo|.
* Need to somehow implement deep links like "ruby api#Kernel#system" where
  "system" is a nested heading under "Kernel".
* Outline API support.

## License

The following licensing applies to Xi personal wiki language:
Attribution-NonCommercial-NoDerivatives 4.0 International
(CC BY-NC-ND 4.0). For more information go to
[https://creativecommons.org/licenses/by-nc-nd/4.0/](https://creativecommons.org/licenses/by-nc-nd/4.0/)

xi test @

Todo .
# Links are not working in this test.
# '#' list symbol is not working.

. Text with {i input param}, {- cli param}, {i(typed) param}.

|||
|http://foo|
|https://foo|
||| text
text |||
text ||| text
||term||
text ||term||
||term|| text
text ||term|| text
|term with spaces|
text |term with spaces| text
text | text
text | text |
text | text | text
text |{lng:foo}not a term but language| text
. text |{lng:foo}not a term but language| text
. |{}term|.
. |{}| this is term.
. |||
. ||| text
. ||term||
. ||term|| text
. text |||
. text ||| text
. text ||term||
. text ||term|| text
. |http://foo|
. |https://foo|
| code
|{lng:foo} code
| {lng:foo} code
  | code
. | code
. |{lng:foo} code
  |{lng:foo} code
  |{lng:foo}
  |
. | {lng:foo} code
. |not a code
! | code
? | code
. text | not a code
[0.0...1.0) range, not a link.
. |{}| non-text item (no meta).
. |{| and |}| two non-text items.
. |{x}| Non-text item, not a language specifier.
. |{x}|: Non-text item and |:|.
|{lng:py}a = 1| inline code with spaces, one per line, no '|'.
|{lng:py}a=1| inline code without spaces, |{lng:py}a=1|2|.
. |{lng:py}a = 1|: inline code after paragraph.
. Text with {i input} arg.
. |{lng:js}
  | [notlink]
[jump test]
[c] - single wikiword.
kh1 .
h1 link[] .
h1 local link [#1] .
h1 wikiword link [wikiword] .
. Paragraph.
  h2 .
  h2 link[] .
  h2 local link [#1] .
  h2 wikiword link [wikiword] .
  . Paragraph.
    h3 .
    h3 link[] .
    h3 local link [#1] .
    h3 wikiword link [wikiword] .
    . Paragraph.
      h4 .
      h4 link[] .
      h4 local link [#1] .
      h4 wikiword link [wikiword] .
      . Paragraph.
        h5 .
        h5 link[] .
        h5 local link [#1] .
        h5 wikiword link [wikiword] .
        . Paragraph.
          h6 .
          h6 link[] .
          h5 local link [#1] .
          h6 wikiword link [wikiword] .
          . Paragraph.
. | dot at end is always paragraph .
. dot at end is always paragraph $ .
not a link [] .
paragraph$ .
wrong color of following square braces [] .
wrong header color $ .
[] .
. Above is h1.
  [] .
  . Above is h2.
  | . text .
  . Above is h3.

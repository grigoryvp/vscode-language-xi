xi = header / paragraph

header = indent text end_of_header

end_of_header = " ." EOS

paragraph =  begin_of_paragraph text EOS

begin_of_paragraph = indent ". "

text = match:(!begin_of_paragraph !end_of_header !EOS .) + {
  // [[,,,"f"], [,,,"o"], [,,,"o"]] => "foo"
  return match.map(v => v.pop()).join("");
}

indent = "  " *

EOS = EOL / EOF

EOL = "\n"

EOF = !.

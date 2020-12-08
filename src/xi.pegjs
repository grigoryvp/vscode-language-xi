xi = header / paragraph_start / paragraph_body

header = indent match:(!end_of_header !EOS .) + end_of_header {
  // [[,,,"f"], [,,,"o"], [,,,"o"]] => "foo"
  return match.map(v => v.pop()).join("");
}

end_of_header = " ." EOS

paragraph_start = indent ". " match:(!EOS .) + EOS {
  return match.map(v => v.pop()).join("");
}

paragraph_body = indent match:(!EOS .) + EOS {
  return match.map(v => v.pop()).join("");
}

indent = "  " *

EOS = EOL / EOF

EOL = "\n"

EOF = !.

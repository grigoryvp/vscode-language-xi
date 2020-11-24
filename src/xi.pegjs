xi = header / paragraph

header = text end_of_header

end_of_header = " ." EOS

paragraph =  begin_of_paragraph text EOS

begin_of_paragraph = indent ". "

text = (!begin_of_paragraph !end_of_header !EOS .) +

indent = "  " *

EOS = EOL / EOF

EOL = "\n"

EOF = !.

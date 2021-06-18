Lua syntax @

. [lua table].
. [lua error handling].
. [lua metatable].
. [lua metamethod].
. [lua garbage collector].
. [lua multiple assignment].

General .
. Case-sensitive.
. First-class functions.

Nonusual .
. Items are indexed from 1.
. Referencing unbound name evaluates to |nil|.
. All variables are in global scope by default, unless |local| keyword.
. Strings are 8-bit without terminating null, no [unicode] support.
. 0, empty string and empty containers are coerced into |true|.
. All [composite data type]s (list, map etc) are single [lua table] type.
. Using length on non-sequence tables with holes is implementation-specific.
. All numbers are 64-bit [float]s.
. Has |goto| statement.
. Strings concatenated via |..|, not |+|.
. No |++| or |+=|.
. "Not equal" is |~=|.
. |for| range includes both ends.
. |#| "length" prefix operator.
. |else if| is |elseif|, not |elif| or |else if|.
. |repeat| with |until| loop.
. No |continue| for loops.
. Calls with one string or table param don't need parens.
. "Instance methods" [lua metatable] is set for strings, but not tables.

Comment[] .
. Line comments are from |--| to |EOL|.
. Block comments are from |--[[| to |]]|.

Entry point .
. Not required.

Name binding[] .
Scope[] .
. Expressions are evaluated and then assigned.
  |{lng:lua}
  | x = y + 2   -- first evaluate 'y + 2', than assign result to 'x'
. [Augmented assignment] not implemented due to a single-pass compiler.
. [Destructuring assignment] via [lua multiple assignment].
. Name is any string of Latin letters, Arabic-Indic digits, and underscores,
  not beginning with a digit and not being a reserved word.
. As a convention, programs should avoid creating names that start with
  an underscore followed by one or more uppercase letters, ex |_VERSION|.
. Variable defined in a loop operator is in operator's body scope, ex:
  |{lng:lua}
  | for i = 1, 2 do foo() end print(i) -- prints nil, 'i' is out of scope
  All other variables defined in Lua default to the `global` scope unless
  they use `local` keyword, ex:
  |{lng:lua}
  | function foo() a = 1 end
  | print( a )        -- nil
  | foo(); print( a ) -- 1, in foo() 'a' is defined in global scope
  | function bar() local b = 1 end
  | bar(); print( b ) -- nil, 'b' is in bar()'s scope, not in our scope

Data type[] .
  Primitive data type[] .
  . No primitive data types, everything is an object.
  Composite data type[] .
  . Via [lua table]s.
  Anonymous data type[] .
  . Via [lua table]s.
  Nullable data type[] .
  . The type |nil| has one single value, |nil|.
  Boolean data type[] .
  . The type |boolean| has two values, |false| and |true|.
  . |false| and |nil| are caerced to |false|, everything else to |true|
    ! Including 0, "", empty containers.
  . No |boolean| type before [lua version#5.0], |nil| was used instead.
  Literal constructor[] .
  . [lua table#literal constructor].
  . A raw string "long literal" starts with "[", followed by zero or more "="
    and then "[" again. Ends with the matching square braces and equals:
    |{lng:lua}
    | level0 = [[
    |   foo
    | ]]
    | level2 = [==[ bar ]==]
  String .
  . Immutable.
  . Strings can contain any 8-bit value, including embedded zeros ('\0'):
    |{lng:lua}
    | a, b, c = "test", 'test', [[test]]
    Unicode .
    . Not supported, strings are bytes, third-party libs are used.
    Escape .
    . [c]-like escape sequences recognized within quoted strings.
    . The escape sequence |\z| skips the following span of whitespace
      characters, including line breaks.
    . The [utf-8] encoding of a Unicode character can be inserted in
      a literal string with the escape sequence |\u{XXX}| (with mandatory
      enclosing braces), where XXX is a sequence of one or more hexadecimal
      digits representing the character code point.
    Concatenation .
    . Via [lua syntax#operator#concatenation].
    Substring .
    . Via [lua api#$ string].
    Length .
    . Via the [lua syntax#operator#length].
    Line span .
    . Via "long literal" constructor.
    String interpolation[] .
    . Via [lua api#string#format].
  List[] .
  . Emulated via general [lua table] data type.
  Set[] .
  . Emulated via general [lua table]s:
    |{lng:lua}
    | local set = {pear = true, plum = true}
  Map[] .
  . Emulated via general [lua table] data type.
  Enum .
  . Emulated via general [lua table]s:
    |{lng:lua}
    | Colors = {RED = 1, GREEN = 2, BLUE = 3}
  Tuple[] .
  . Via [lua multiple assignment].
  Range[] .
  . Built into [lua syntax#for loop] syntax.
  Type conversion[] .
  . See [lua syntax#boolean data type].
  . [lua api#string#format] converts numbers to strings.
  . [lua api#tonumber] explicitly converts strings to numbers.
  Type coercion[] .
  . Bitwise operators always convert float operands to integers.
  . Exp and float division always convert integer operands to floats. All
    other arithmetic operations applied to mixed numbers (integers and
    floats) convert the integer operand to a float.
  . String concatenation accepts numbers as arguments, besides strings.
  . Conversion from float to integer fails if no exact representation exists.
  . The string library sets [lua metamethod]s that try to coerce
    [lua api#* string] to numbers in all arithmetic operations. They are not
    always applied; in particular, |"1"==1| is false and |"1"<1| raises
    an error. These coercions exist mainly for compatibility and may be
    removed in future versions of the language.
  Type inference[] .
  . Not needed for dynamic language.
  Object copy[] .
  . [shallow copy] array [lua table] via [lua api#$ table#unpack].

Operator[] .
. Supports most [c syntax#operator]s.
. Power operator |^|.
. |{lng:lua}
  | 3 / 2 -- 1.5, all numbers are float
. Ternary emulated via [programming language tricks]: "and or", ex:
  |{lng:lua}
  | a = b and c or d -- c must be not nil and not false
  Bitwise .
  . Supported since [lua version#5.3], |bit32| library before that.
  . |&|, |||, |^|, |~| ("exclusive or", "unary not"), |<<|, |>>|.
  Logical .
  . [short circuit logic].
  . |and|, |or|, |not|, |>|, |>=|, |<|, |<=|.
    |{lng:lua}
    | not false == true; not nil == true; -- everything else, ex 0, is false
    | - a   -- -(-1) == 1
    | not foo and not bar or baz -- ((not foo) and (not bar)) or baz
  Value equality .
  . |==| and |~=| uses following logic:
    * |false| if types are different.
    * |true| if value is same for strings and numbers. Do not convert
      strings to numbers or vice versa.
    * |true| if [lua table], |userdate| or |thread| reference the same object:
      |{lng:lua}
      | {} == {} -- false; references to two different objects
    * [lua metamethod#__eq], if any.
  Object identity test operator[] .
  . [lua api#rawequal].
  Sequence membership .
  . Accessing [lua table] key without a value evaluats to |nil|.
  Operator overload[] .
  . Via [lua metamethod]s.
  Length .
  . |#| prefix operator that maps to the [lua metamethod#__len]:
    |{lng:lua}
    | len1, len2 = # str1, #str2
  . Applied on a [lua table] returns a border in that table (index present in
    the table that is followed by an absent index; or zero, when index 1 is
    absent).
  Concatenation .
  . |..| operator that maps to the [lua metamethod#__concat].

Expression[] .
  Compound .
  . Operators and |()|.
  Conditional .
  . Via [lua syntax#operator#logical].
  Relational .
  . |{lng:lua}
    | a == 1 -- evaluates to true or false

Statement[] .
. Can be separated with optional |;|.
. Newlines are same token separators as spaces:
  |{lng:lua}
  | foo = 
  |   2
  If-then-else .
  . |{lng:lua}
    | if a > 0 then print(a) end
    | if a > 0 then print(a) else print("b") end
    | if a > 0 then print(a) elseif a < 0 print("-") end
  For loop .
  . |{lng:lua}
    | for i = 1, 5 do print(i) end -- range includes both ends
    | for i = 5, 1, -1 do print(i) end -- optional step
  For iterator .
  . Via [lua api#pairs], [lua api#ipairs], [lua api#next].
  While loop .
  . |{lng:lua}
    | while foo() do bar() end
  Do-while loop .
  . |{lng:lua}
    | repeat foo() until bar()
  Break loop .
  . |{lng:lua}
    | break
  . Must be last statement in a block (becouse breaks block), ex:
    |{lng:lua}
    | while true do if a > 5 then a = 0; break end end -- ok
    | while true do if a > 5 then break; a = 0 end -- syntax error

Callable[] .
. Calls with one string or table param don't need parens:
  |{lng:lua}
  | print "foo"
  | print {bar = 1}
  | print 1 -- syntax error
. |function|, |end| pair forms an expression:
  |{lng:lua}
  | hs.hotkey.bind({}, "capslock", function() hs.alert.show("debug") end)
  Procedure .
  . |{lng:lua}
    | bar = {}
    | local function foo(x) return x * 2 end
    | function bar.baz() return ":)" end
    This is a syntax sugar to function [definition] assignment [statement]:
    |{lng:lua}
    | local foo; foo = function (x) return x * 2 end
    | bar.baz = function() return ":)" end
  Parameter[] .
  . When a Lua function is called, it adjusts its list of arguments to
    the length of its list of parameters, unless the function is a vararg
    function, which is indicated by |...| at the end of its parameter list. 
  . |...| within vararg functin expands into "rest arguments":
    |{lng:lua}
    | function foo(a, b, ...)
    |   c, d = ... -- 3, 4
    | end
    | foo(1, 2, 3, 4)
  . |...| can be used with [lua table] constructor:
    |{lng:lua}
    | function foo(...) for k, v in pairs({...}) do print(k, v) end end
  Return[] .
  . Multiple return value emulated via [lua multiple assignment].
  Anonymous function .
  . As in [js] and [scheme] all functions are anonymous. A "named
    function" is a variable holding a reference to a function object.
  . Functions encloses parent scope(s).

Class[] .
. |:| during a call is a syntactic sugar to pass the "call receiver" as
  a first argument. Following lines generate the same bytecode:
  |{lng:lua}
  | foo:bar()
  | foo.bar(foo)
. |:| during callable declaration is a syntactic sugar that creates
  callable with a hidden first parameter named |self| (and sets this
  callable as an attribute for a left-hand lua table). Following lines
  generate the same bytecode:
  |{lng:lua}
  | function obj:foo() end
  | function obj.foo(self) end
  | obj.foo = function(self) end
. Class emulation via |self| and [lua metamethod#__index]:
  |{lng:lua}
  | -- 'Dog' is class object
  | function Dog:new()
  |   local inst = {sound = 'woof'}
  |   -- Use the class object for attributes not found on the instance object 
  |   return setmetatable(inst, {__index = self})
  | end
  | -- Method is bound to the class object, but available via metatable
  | function Dog:makeSound()
  |   -- 'self' here will be an instance object (call receiver)
  |   print('I say ' .. self.sound)
  | end
  | mrDog = Dog:new()
  | mrDog:makeSound()
. It'a also ideomatic to set class object as a metatable for class instances,
  so special [lua metamethod]s can be defined on class object:
  |{lng:lua}
  | function Dog:new()
  |   self.__index = self
  |   return setmetatable({}, self)
  | end

Inheritance[] .

Interface[] .
Abstract class[] .

Generic[] .

Decorator[] .

Property[] .

Category[] .
Mixin[] .

Generator[] .

Preprocessor[] .

Dependency management[] .
. |a.lua|:
  |{lng:lua}
  | function foo() print("foo") end
  | local val = 1
  |b.lua|:
  |{lng:lua}
  | require "a"
  | a.foo()
  | print(a.val) -- error, package local
  Build-in table |package| allows to enumerate and manage modules:
  |{lng:lua}
  | for k, v in pairs(package) do print(k, v) end -- list packages
  | package.loaded.a = nil; require "a"               -- reload package
. |require| searches directories specified in the |package.path|, which
  can be set via the |LUA_PATH| environment variable:
  |{lng:lua}
  | package.path = package.path .. ";/Users/user/dotfiles/hammerspoon/?.lua"
  | require "lib"
  | someNameFromLibNamespace()

Error handling[] .
. [lua error handling].

Reflection[] .
. [lua debug].

Test[] .
  Assert .
  . |{lng:lua}
    | assert(exp); assert(exp. "error")
  ! |assert(0)| don't work, use |assert(nil)| or |assert(false)|.

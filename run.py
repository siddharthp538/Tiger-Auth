import sys
a = sys.argv[1]
b = sys.argv[2]
def fun(a,b):
    return (int(a)+int(b))
print(fun(a,b))
sys.stdout.flush()
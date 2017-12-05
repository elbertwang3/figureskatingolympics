import argparse
import sys
import numpy as np
def main(array):
	print(array)

	array = [int(x) for x in array]
	print array
	mean(array)

def mean(array):
	array.remove(max(array))
	array.remove(min(array))
	print 'removed: ' + str(array)
	print sum(array) / float(len(array))
	

if __name__ == "__main__":
    main(sys.argv[1:])
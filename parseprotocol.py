import sys
import re
import csv

def main(args):
	
	
	file1 = open('data/protocol.csv', 'r')
	file2 = open('data/womenprotocols.csv', 'a')
	csvreader = csv.reader(file1,delimiter=' ')
	csvwriter = csv.writer(file2)
	towrite = ['Yuna Kim','South Korea','2010 Winter Olympics','02/25/10']
	elements = []
	basevalues = []
	goeavgs = []
	
	for row in csvreader:
		print row
		if "x" in row:
			print "getting here x"
			row.remove('x')
		if "X" in row:
			print "getting here X"
			row.remove('X')
			print row
		if "<" in row:
			print "getting here <"
			row.remove('<')
			print row
		if "e" in row:
			print "getting here e"
			row.remove('e')
		if "!" in row:
			print "getting here !"
			row.remove('!')
		if "-" in row:
			print "getting here e"


			row = [x for x in row if x != '-']
			print row
		element = row[1]
		basevalue = row[2]
		goe = row[3]
		
		length = len(row)
		goeavg = row[4:length-1]

		#assert(len(goeavg) == 9)
		elementtotal = row[length - 1]
		#print element
		#print basevalue
		#print goe
		#print goeavg
		#print elementtotal
		assert(len(goeavg) == 9)
		elements.append(element)
		basevalues.append(basevalue)
		goeavgs.append(goeavg)
	#print elements
	#print basevalues
	#print goeavgs
	towrite.extend((elements, basevalues, goeavgs))
	print towrite

	csvwriter.writerow(towrite)



if __name__ == "__main__":
    main(sys.argv[1:])
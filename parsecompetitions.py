import sys
import re
import csv

def main(args):
	
	
	file1 = open('data/womencompetitions.csv', 'r')
	file2 = open('data/mencompetitions2.csv', 'a')
	csvreader = csv.reader(file1,delimiter='\t')
	csvwriter = csv.writer(file2)
	currentyear = 2002
	for i, row in enumerate(csvreader):
		if i % 3 == 0:
			currentyear += 4
		print currentyear
		print row
		name = row[1]
		country = row[2].strip()
		combined = round((float(row[5]) + float(row[7])),2)
		#combined = row[3]
		sp = row[5]
		fs = row[7]
		rank = row[0]	

		competition = str(currentyear) + " Winter Olympics"
		towrite = [name,country,sp,fs,combined,rank,competition]
		csvwriter.writerow(towrite)
	#print elements
	#print basevalues
	#print goeavgs
	#towrite.extend((elements, basevalues, goeavgs))
	#print towrite

	#csvwriter.writerow(towrite)



if __name__ == "__main__":
    main(sys.argv[1:])
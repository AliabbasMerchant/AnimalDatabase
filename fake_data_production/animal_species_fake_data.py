import xlrd
import mysql.connector
import random

mydb = mysql.connector.connect(
  host = "localhost",
  user="root",
  passwd="root",
  database="wildlife"
)

mycursor = mydb.cursor()

mycursor.execute("CREATE DATABASE IF NOT EXISTS wildlife")
mycursor.execute("CREATE TABLE IF NOT EXISTS animal_species_table ( animal_species VARCHAR(255) NOT NULL PRIMARY KEY, common_name VARCHAR(255) NOT NULL, description TEXT, _genus VARCHAR(255), _order VARCHAR(255), _class VARCHAR(255), _phylum VARCHAR(255), _status VARCHAR(100));")
loc = ("Animal_Species_Data.xlsx")
data = [];
wb = xlrd.open_workbook(loc) 
sheet = wb.sheet_by_index(0) 

sheet.cell_value(0, 0) 

for i in range(1, sheet.nrows):
    data.append(sheet.row_values(i))
    sql = "INSERT INTO animal_species_table (animal_species, common_name, description, _genus, _order, _class, _phylum, _status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    val = (data[i-1][0], data[i-1][1], data[i-1][2], data[i-1][3], data[i-1][4], data[i-1][5], data[i-1][6], data[i-1][7])
    mycursor.execute(sql, val)
    mydb.commit()

mydb.close()
mycursor.close()

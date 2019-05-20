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
mycursor.execute("CREATE TABLE IF NOT EXISTS animals_table ( animal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), dob DATE, status VARCHAR(100), gender VARCHAR(100), description TEXT, photo BLOB, animal_species VARCHAR(255) NOT NULL REFERENCES animal_species(animal_species), location POINT);")
loc = ("Animals_Data.xlsx")
data = [];
wb = xlrd.open_workbook(loc) 
sheet = wb.sheet_by_index(0) 

sheet.cell_value(0, 0) 

for i in range(1, sheet.nrows):
    data.append(sheet.row_values(i))
    sql = f"INSERT INTO animals_table (name, dob, status, gender, description, photo, animal_species, location) VALUES ('{data[i-1][0]}', '{random.randrange(1900, 2019)}-{random.randrange(0, 12):02d}-{random.randrange(0, 30):02d}', '{data[i-1][2]}', '{data[i-1][3]}', '{data[i-1][4]}', '{data[i-1][5]}', '{data[i-1][6]}', POINT({random.randrange(0,20):02d}, {random.randrange(0,20):02d}));"
    mycursor.execute(sql)
    mydb.commit()

mycursor.close()
mydb.close()
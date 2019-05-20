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
mycursor.execute("CREATE TABLE IF NOT EXISTS plants_table ( plant_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, description TEXT, number INT, status VARCHAR(100), plant_species VARCHAR(255) NOT NULL REFERENCES plant_species(plant_species), location POINT);")
loc = ("Plants_Data.xlsx")
data = [];
wb = xlrd.open_workbook(loc) 
sheet = wb.sheet_by_index(0) 

sheet.cell_value(0, 0) 

for i in range(1, sheet.nrows):
    data.append(sheet.row_values(i))
    sql = f"INSERT INTO plants_table (description, number, status, plant_species, location) VALUES ('{data[i-1][0]}', '{random.randrange(0, 500):03d}', '{data[i-1][2]}', '{data[i-1][3]}', POINT({random.randrange(0,20):02d}, {random.randrange(0,20):02d}))"
    mycursor.execute(sql)
    mydb.commit()

mycursor.close()
mydb.close()
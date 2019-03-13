class SqlLiteDB {
  constructor() {
    this.db = openDatabase("myDB", "1.0", "test db", 1024 * 100);
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SqlLiteDB();
    }
    return this.instance;
  }

  createTable(sql, param) {
    this.db.transaction((tx) => {
      tx.executeSql(sql, param);
    })
  }

  addData(name, message, time) {
    this.db.transaction((tx) => {
      tx.executeSql("insert into MsgData values (?,?,?)", [name, message, time], (tx, rs) => {
        window.alert("插入成功！");
      }, (tx, error) => {
        window.alert(error.source + "::" + error.message);
      });
    })
  }

  getData() {
    let deffer = new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql("select * from MsgData", [], (tx, rs) => {
          window.alert("获取成功");
          let rowArr = Array.from(rs.rows)
          resolve(rowArr)
        }, (tx, error) => {
          window.alert(error.source + "::" + error.message);
        });
      })
    })
    return deffer
  }
}

let sqlDb = SqlLiteDB.getInstance()
sqlDb.createTable("create table if not exists MsgData(name text,message text,time integer)", [])
// sqlDb.addData('alibaba','hello','b10')

async function creatDom() {

  let sqlData = sqlDb.getData();
  // let elementStr = `<ul>`;
  let parentElement = document.querySelector('#container');
  let ulElement = document.createElement(`ul`)

  await sqlData.then(res => {
    res.map(msg => {
      let liElement = document.createElement(`li`)
      liElement.append(msg.name)
      ulElement.appendChild(liElement)
      // elementStr += `<li>${msg.name}</li>`;
    })
  })
  
  parentElement.append(ulElement)
  // return elementStr + '</ul>'
}

creatDom()


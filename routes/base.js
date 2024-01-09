let mysql =  require('mysql');

class Base{

    // 获取sql连接
    getConnect(){
        if(!this.pool)this.pool = mysql.createPool(process.env.DB_URL);
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err,conn)=>{
                return err?reject(err):resolve(conn);
            })
        })
    }

    // 执行sql
    // sql : eg.SELECT * FROM users WHERE id = ?, name = ?,
    // err: [userId, name]
    execSql(sql,arr=[]){
        return this.getConnect().then(conn=>{
            return new Promise((resolve, reject) =>
                conn.query(sql,arr,(err,res)=>{
                    conn.release();
                    err?reject(err):resolve(res)
                })
            );
        })
    }

}

// 导出
module.exports = new Base();

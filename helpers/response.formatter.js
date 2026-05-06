module.exports = {
    //response: nama key object yang akan dipanggil pas export/require di file lain
    response: (status, message, data) => {
        if (data) {
            //kalau responsenya ada data, maka return data juga
            return {
                status: status,
                message: message,
                data: data
            }
        } else {
            //kalau responsenya gak ada data (misal error), hasil di postman nya jangan kirim key dat adi jsonnya
            return {
                status: status,
                message: message
            }
        }
    }
}
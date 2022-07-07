//Sandip
const jwt = require("jsonwebtoken")
//const ObjectId = mongoose.Schema.Types.ObjectId;
const bookModel = require('../models/bookModel')

const{isEmpty,isValidString,isValidISBN}=require('../middleware/validation')

const createBook = async function (req, res) {

    try {
        let data = req.body;
        // destructuring the request body
        const { title, excerpt, userId, ISBN, category, subcategory } = data

        // checking if request body is empty
        if (Object.keys(data).length == 0) { res.status(400).send({ status: false, msg: "Enter the Books details" }) }

        // checking if requireq fields is provided in request body
        if (!title) { return res.status(400).send({ status: false, msg: "title is required" }) }
        if (!excerpt) { return res.status(400).send({ status: false, msg: "excerpt is required" }) }
        if (!userId) { return res.status(400).send({ status: false, msg: "userId is required" }) }
        if (!ISBN) { return res.status(400).send({ status: false, msg: "ISBN is required" }) }
        if (!category) { return res.status(400).send({ status: false, msg: "category is required" }) }
        if (!subcategory) { return res.status(400).send({ status: false, msg: "subcategory is required" }) }

        // checking if requireq fields is empty in request body
        if(!isEmpty(title)) return res.status(400).send({ status: false, msg: "Please enter Title" })
        if (!isValidString(title)) return res.status(400).send({ status: false, message: "Title is not valid" })

        if (!isEmpty(excerpt)) { return res.status(400).send({ status: false, msg: "excerpt is required" }) }
        if (!isValidString(excerpt)) return res.status(400).send({ status: false, message: "excerpt is not valid" })

        if (!isEmpty(ISBN)) { return res.status(400).send({ status: false, msg: "ISBN is required" }) }
        if (!isValidISBN(ISBN)) { return res.status(400).send({ status: false, msg: "ISBN is not valid" }) }

        if (!isEmpty(category)) { return res.status(400).send({ status: false, msg: "category is required" }) }

        if (!isEmpty(subcategory)) { return res.status(400).send({ status: false, msg: "subcategory is required" }) }
        
        //if(isVerifyString(title)) return res.status(400).send({ status: false, msg: "Title is Invalid" })
        

        let bookData = await bookModel.create(data);
        res.status(201).send({ status: true, msg: bookData })

    } catch (error) {
        console.log("Server Error", error.message)
        res.status(500).send({ status: false, msg: "Server Error: " + error.message })
    }

}

const getBooks = async function (req, res) {
    try {

        let allQuery = req.query
        let booksDetail = await bookModel.find(({ $and: [allQuery, { isDeleted: false }] }))
        console.log(booksDetail)
        if (booksDetail == false)
            res.status("404").send({ status: false, msg: "data not found" })
        else
            {
                let data=[]
                for(let i=0;i<booksDetail.length;i++){
            let books={
                "title": booksDetail[i].title,
                "excerpt": booksDetail[i].excerpt,
                "userId" : booksDetail[i].userId,
                "category" : booksDetail[i].category,
                "releasedAt" : booksDetail[i].releasedAt,
                "reviews" : booksDetail[i].reviews
            } 
            data.push(books)
            
                
        }
        data.sort(function(a,b){
            if(a.title.toLowerCase()<b.title.toLowerCase())return -1;
            if(a.title.toLowerCase()>b.title.toLowerCase())return 1
            return 0;
        })
            
            
            console.log(data) 
            res.status(200).send({ status: true, message : "Books List" , data: data })}
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




const deleteBooks = async function (req, res) {
    try {
        let book = req.params.bookId
        console.log(book)
        const check = await bookModel.findById(book)
        if(check.isDeleted==true) return res.status(200).send({ status: false, msg: "data is already deleted" })
        let DeletedBook = await bookModel.findByIdAndUpdate(  { _id: book }, {$set: { isDeleted: true }}, {new: true})
        return res.status(200).send({ status: true, data: DeletedBook })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }


}

module.exports.createBook = createBook;
module.exports.getBooks=getBooks
module.exports.deleteBooks=deleteBooks
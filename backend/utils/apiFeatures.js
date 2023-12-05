class APIFeatures {
    constructor (query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        
        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;

    }

    filter(){
        const queryCopy = {...this.queryStr};

        console.log(queryCopy);

        //Removing fields from the query
        const removeFields = ['keyword', 'limit','page']
        removeFields.forEach(e1 => delete queryCopy[e1]);


        //Advance filters for price , rating etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        

        this.query = this.query.find(queryStr);
        return this; 
    }

    pagination(resPerPage){
        const currentPage = Number (this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.skip(skip).limit(resPerPage);
        return this;
    }
}

module.exports = APIFeatures
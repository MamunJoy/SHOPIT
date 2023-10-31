const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter the product name'],
        trim: true,
        maxLength: [100, 'product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'please enter the product price'],
        maxLength: [5, 'product name cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'please enter the product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images:[
        {
            public_id: {
                type:String,
                required:true
            },
            url: {
                type:String,
                required:true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'please select the category for this product'],
        enum: {
            values: [
                'Electronics',
                'Fashtion',
                'Leptop',
                'Accessories',
                'Headphones',
                'Smartphones',
                'Tablets',
                'Cameras',
                'Home Appliances',
                'Kitchen Appliances',
                'Baby Products',
                'Sports Equipments',
                'Outdoor Gear',
                'Beauty & Health',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Pet Supplies',
                'Home',
                'Other'
            ],
            message: 'please select correct category for product'
        }
    },
    seller: {
        type: String,
        required: [true, 'please enter product seller']
    },
    stock: {
        type:Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },
    numOfRwviews: {
        type:Number,
        default: 0
    },
    reviews:[
        {
            name: {
                type:String,
                required: true
            },
            comment: {
                type:String,
                required: true
            }
        }
    ],
    createAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('product', productSchema);
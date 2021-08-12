const mongoose = require('mongoose');
const Post = require('./models/post');

mongoose.connect('mongodb://localhost:27017/kunstKanon', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// })
// p.save()
//     .then(p => {
//         console.log(p)
//     })
//     .catch(e => {
//         console.log(e)
//     })

const seedPosts = [
    {
        title: 'Bert',
        author: "610865fc10a998913d4e2f5d",
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627125245766-230a0c00a139?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=792&q=80',
        comments: [
            {
                title: "first comment title",
                author: "610865fc10a998913d4e2f5d"
            },
            {
                title: "second comment title",
                author: "610865fc10a998913d4e2f5d"
            }
        ],
        totalStars: 2,
        stars: [
            {
                stars: 3,
                author: "611256a54a30ba3bcb93466e"
            },
            {
                stars: 2,
                author: "610865fc10a998913d4e2f5d"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        title: 'Alberto',
        author: "611256a54a30ba3bcb93466e",
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627302664020-1f583c27adb8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
        comments: [
            {
                title: "first comment title",
                author: "610865fc10a998913d4e2f5d"
            }
        ],
        totalStars: 1,
        stars: [
            {
                stars: 1,
                author: "611256a54a30ba3bcb93466e"
            },
            {
                stars: 2,
                author: "610865fc10a998913d4e2f5d"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        title: 'DJitid',
        author: "610865fc10a998913d4e2f5d",
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627249393768-eec547e74d52?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
        comments: [
            {
                title: "first comment title",
                author: "610865fc10a998913d4e2f5d"
            },
            {
                title: "second comment title",
                author: "611256a54a30ba3bcb93466e"
            }
        ],
        totalStars: 3,
        stars: [
            {
                stars: 3,
                author: "611256a54a30ba3bcb93466e"
            },
            {
                stars: 4,
                author: "610865fc10a998913d4e2f5d"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        title: 'Lola',
        author: "611256a54a30ba3bcb93466e",
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627301186830-3ce112ebed84?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
        comments: [
            {
                title: "first comment title",
                author: "611256a54a30ba3bcb93466e"
            },
            {
                title: "second comment title",
                author: "610865fc10a998913d4e2f5d"
            }
        ],
        totalStars: 4,
        stars: [
            {
                stars: 5,
                author: "610865fc10a998913d4e2f5d"
            },
            {
                stars: 4,
                author: "611256a54a30ba3bcb93466e"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        title: 'Lilo',
        author: "611256a54a30ba3bcb93466e",
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627248529348-a48a8504e8c6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        comments: [
            {
                title: "first comment title",
                author: "610865fc10a998913d4e2f5d"
            },
            {
                title: "second comment title",
                author: "611256a54a30ba3bcb93466e"
            }
        ],
        totalStars: 0,
        stars: [
            {
                stars: 5,
                author: "610865fc10a998913d4e2f5d"
            },
            {
                stars: 4,
                author: "611256a54a30ba3bcb93466e"
            }
        ],
        tags: ["drama", "romance", "action", "adventure", "fantasy", "horror", "crime", "mistery", "avant-garde", "teen", "fiction"]
    }
]


const seedDB = async() => {
    await Post.deleteMany({});
    await Post.insertMany(seedPosts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })
}

seedDB();

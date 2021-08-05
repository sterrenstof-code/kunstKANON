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
        username: 'Bert',
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627125245766-230a0c00a139?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=792&q=80',
        comments: [
            {
                title: "first comment title",
                username: "test username"
            },
            {
                title: "second comment title",
                username: "another test username"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        username: 'Alberto',
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627302664020-1f583c27adb8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
        comments: [
            {
                title: "first comment title",
                username: "test username"
            },
            {
                title: "second comment title",
                username: "another test username"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        username: 'DJitid',
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627249393768-eec547e74d52?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
        comments: [
            {
                title: "first comment title",
                username: "test username"
            },
            {
                title: "second comment title",
                username: "another test username"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        username: 'Lola',
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627301186830-3ce112ebed84?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
        comments: [
            {
                title: "first comment title",
                username: "test username"
            },
            {
                title: "second comment title",
                username: "another test username"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    },
    {
        username: 'Lilo',
        caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad vel ipsum consectetur dolor voluptates aperiam odit aut a explicabo magni, soluta nesciunt fugiat blanditiis rerum eveniet similique enim provident deleniti nam sunt perspiciatis temporibus reprehenderit inventore aliquam? Molestias, harum tempore explicabo, temporibus eaque iusto cum eligendi perferendis ad consectetur quisquam at maxime maiores doloremque sint officia iure repudiandae voluptatibus autem possimus? Quibusdam deleniti quaerat iure voluptas vero obcaecati iste dolorem eaque, molestiae esse consequuntur? Dolores voluptatibus quibusdam quo, earum fuga reiciendis dolor atque ipsam quas. Maiores provident magni laudantium eos, possimus vitae molestiae praesentium quia perspiciatis officiis numquam voluptatem quisquam.',
        image: 'https://images.unsplash.com/photo-1627248529348-a48a8504e8c6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        comments: [
            {
                title: "first comment title",
                username: "test username"
            },
            {
                title: "second comment title",
                username: "another test username"
            }
        ],
        tags: ["drama", "romance", "teen", "fiction"]
    }
]

Post.insertMany(seedPosts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })
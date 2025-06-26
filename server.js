// server.js
const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // byt ut med din nyckel
const cors = require("cors");

const allowedOrigins = ["http://localhost:8000", "http://192.168.1.236:8000"]; // lägg till din lokala IP eller domän

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: false
}));

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const { cartItems } = req.body;

    const line_items = cartItems.map(item => ({
        price_data: {
            currency: "sek",
            product_data: { name: item.name },
            unit_amount: item.price * 100, // i öre
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url: "https://dittdomannamn.se/success.html",
        cancel_url: "https://dittdomannamn.se/cart.html",
    });

    res.json({ url: session.url });
});

app.listen(10000, () => console.log("Server körs på port 10000"));

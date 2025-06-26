// server.js
const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_51ReIDNPVe03PsQIiuyo0JkmAbVJ87Tidt9PJpD84SdWAdbyWqquFGrXFvdMKG3cmvNkcjRMntnSt1bhGuAgdAtdU00JhsmKxO0"); // byt ut med din nyckel
const cors = require("cors");

app.use(cors({
    origin: "https://evelinarudin.github.io",
    methods: ["GET", "POST"],
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));


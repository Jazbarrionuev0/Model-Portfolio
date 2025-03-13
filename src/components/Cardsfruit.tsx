import { motion, Variants } from "framer-motion";

interface Props {
    emoji: string;
}

const cardVariants: Variants = {
    offscreen: {
        y: 300
    },
    onscreen: {
        y: 50,
        rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};


function Card({ emoji }: Props) {
    const background = `linear-gradient(306deg)`;

    return (
        <motion.div
            className=""
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
        >
            <div className="splash" style={{ background }} />
            <motion.div className="w-36 h-36 mx-8" variants={cardVariants}>
                {emoji}
            </motion.div>
        </motion.div>
    );
}

const food: [string][] = [
    ["🍅"],
    ["🍊"],
    ["🍋"],
    ["🍐"],
    ["🍏"],
    ["🫐"],
    ["🍆"],
    ["🍇"]
];

export default function Cardsfruit() {
    return food.map(([emoji]) => (
        <Card emoji={emoji} key={emoji} />
    ));
}

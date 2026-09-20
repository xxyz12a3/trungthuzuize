// ============================================================
// TRUNG THU - SCRIPT.JS
// Hiệu ứng sao + sao băng + đèn trời + lời chúc
// ============================================================


// ============================================================
// CANVAS - SAO VÀ SAO BĂNG
// ============================================================

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w = 0;
let h = 0;

let stars = [];
let meteors = [];


// ------------------------------------------------------------
// Resize canvas
// ------------------------------------------------------------

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    stars = [];

    const count = Math.floor((w * h) / 2000);

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,

            radius:
                Math.random() * 0.6 + 0.15,

            alpha:
                Math.random() * 0.8 + 0.1,

            twinkle:
                Math.random() * 0.02 + 0.003
        });
    }
}


// ------------------------------------------------------------
// Vẽ sao
// ------------------------------------------------------------

function drawStars() {

    stars.forEach(star => {

        star.alpha +=
            (Math.random() > 0.5 ? 1 : -1)
            * star.twinkle;

        star.alpha = Math.max(
            0.1,
            Math.min(1, star.alpha)
        );

        ctx.beginPath();

        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = "#ffffff";

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });

    ctx.globalAlpha = 1;
}


// ------------------------------------------------------------
// Tạo sao băng
// ------------------------------------------------------------

function createMeteor() {

    const x =
        Math.random() * w;

    const y =
        Math.random() * (h / 3);

    const speed =
        Math.random() * 8 + 6;

    meteors.push({
        x: x,
        y: y,

        vx: speed + 2,
        vy: speed / 2,

        len:
            Math.random() * 100 + 120,

        alpha: 1
    });
}


// ------------------------------------------------------------
// Vẽ sao băng
// ------------------------------------------------------------

function drawMeteors() {

    for (
        let i = meteors.length - 1;
        i >= 0;
        i--
    ) {

        const meteor =
            meteors[i];

        const endX =
            meteor.x - meteor.len;

        const endY =
            meteor.y - meteor.len / 2;


        const gradient =
            ctx.createLinearGradient(
                meteor.x,
                meteor.y,
                endX,
                endY
            );


        gradient.addColorStop(
            0,
            `rgba(255,255,255,${meteor.alpha})`
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );


        ctx.strokeStyle =
            gradient;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            meteor.x,
            meteor.y
        );

        ctx.lineTo(
            endX,
            endY
        );

        ctx.stroke();


        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        meteor.alpha -= 0.015;


        if (
            meteor.alpha <= 0 ||
            meteor.x > w + 200 ||
            meteor.y > h + 200
        ) {
            meteors.splice(i, 1);
        }
    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
}


// ------------------------------------------------------------
// Animation canvas
// ------------------------------------------------------------

function animationLoop() {

    ctx.clearRect(
        0,
        0,
        w,
        h
    );

    drawStars();
    drawMeteors();

    if (Math.random() < 0.01) {
        createMeteor();
    }

    requestAnimationFrame(
        animationLoop
    );
}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();
animationLoop();



// ============================================================
// ELEMENT HTML
// ============================================================

const messageBox =
    document.getElementById("message");

const inviteBox =
    document.getElementById("invite-box");

const wishPopup =
    document.getElementById("wish-popup");

const lanternContainer =
    document.getElementById(
        "lantern-container"
    );


// ============================================================
// BIẾN TRẠNG THÁI
// ============================================================

let lanternClickable = false;

let currentSentence = 0;

let noTextIndex = 0;



// ============================================================
// HIỆN TỪNG CÂU
// ============================================================

function showSentence(sentence) {

    messageBox.innerHTML = "";

    const words =
        sentence.split(" ");

    const wordElements = [];


    const wrapper =
        document.createElement("div");

    wrapper.style.display =
        "flex";

    wrapper.style.flexWrap =
        "wrap";

    wrapper.style.justifyContent =
        "center";

    wrapper.style.alignItems =
        "center";


    words.forEach(
        (word, index) => {

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "word";

            span.textContent =
                word;

            wrapper.appendChild(
                span
            );

            wordElements.push(
                span
            );


            setTimeout(
                () => {
                    span.classList.add(
                        "show"
                    );
                },
                300 * index
            );
        }
    );


    messageBox.appendChild(
        wrapper
    );


    const showTime =
        300 * words.length + 1600;


    setTimeout(
        () => {

            wordElements.forEach(
                (word, index) => {

                    setTimeout(
                        () => {

                            word.classList.remove(
                                "show"
                            );

                            word.classList.add(
                                "hide"
                            );

                        },
                        200 * index
                    );
                }
            );


            const hideTime =
                200 * words.length + 700;


            setTimeout(
                () => {

                    currentSentence++;


                    if (
                        currentSentence <
                        sentences.length
                    ) {

                        showSentence(
                            sentences[
                                currentSentence
                            ]
                        );

                    } else {

                        inviteBox.style.display =
                            "block";
                    }

                },
                hideTime
            );

        },
        showTime
    );
}



// ============================================================
// HIỆN LỜI CHÚC
// ============================================================

function showWish() {

    if (
        !lanternClickable ||
        !wishes ||
        wishes.length === 0
    ) {
        return;
    }


    const wish =
        wishes[
            Math.floor(
                Math.random() *
                wishes.length
            )
        ];


    wishPopup.textContent =
        wish;

    wishPopup.style.display =
        "block";


    // Xóa timer cũ nếu có
    if (
        wishPopup._hideTimer
    ) {
        clearTimeout(
            wishPopup._hideTimer
        );
    }


    wishPopup._hideTimer =
        setTimeout(
            () => {

                wishPopup.style.display =
                    "none";

            },
            3500
        );
}



// ============================================================
// CLICK / CHẠM ĐÈN
// ============================================================

function activateLantern(lantern, event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }


    if (!lanternClickable) {
        return;
    }


    // Hiệu ứng nhẹ khi chạm
    lantern.classList.add(
        "lantern-touched"
    );


    setTimeout(
        () => {
            lantern.classList.remove(
                "lantern-touched"
            );
        },
        400
    );


    showWish();
}



// ============================================================
// TẠO ĐÈN TRỜI
// ============================================================

function createLantern() {

    const img =
        document.createElement("img");


    img.src =
        "./den.png";

    img.className =
        "lantern";


    // --------------------------------------------------------
    // Kích thước ngẫu nhiên
    // --------------------------------------------------------

    const type =
        Math.floor(
            Math.random() * 3
        ) + 1;


    let size;
    let duration;
    let opacity;


    if (type === 1) {

        size =
            15 +
            Math.random() * 15;

        duration =
            14000 +
            Math.random() * 6000;

        opacity = 0.5;

    } else if (type === 2) {

        size =
            20 +
            Math.random() * 25;

        duration =
            10000 +
            Math.random() * 5000;

        opacity = 0.75;

    } else {

        size =
            30 +
            Math.random() * 40;

        duration =
            8000 +
            Math.random() * 4000;

        opacity = 0.95;
    }


    // --------------------------------------------------------
    // Vị trí
    // --------------------------------------------------------

    img.style.width =
        size + "px";

    img.style.left =
        Math.random() * 90 + "vw";

    img.style.bottom =
        Math.random() * 10 + "px";

    img.style.opacity =
        opacity;

    img.style.height =
        "auto";


    // QUAN TRỌNG
    // Đảm bảo đèn nhận click / touch
    img.style.pointerEvents =
        "auto";

    img.style.cursor =
        "pointer";

    img.style.zIndex =
        "10";


    // --------------------------------------------------------
    // Thêm vào container
    // --------------------------------------------------------

    lanternContainer.appendChild(
        img
    );


    // --------------------------------------------------------
    // CLICK MÁY TÍNH
    // --------------------------------------------------------

    img.addEventListener(
        "click",
        event => {

            activateLantern(
                img,
                event
            );

        }
    );


    // --------------------------------------------------------
    // CHẠM ĐIỆN THOẠI
    // --------------------------------------------------------

    img.addEventListener(
        "touchstart",
        event => {

            activateLantern(
                img,
                event
            );

        },
        {
            passive: false
        }
    );


    // --------------------------------------------------------
    // Animation bay lên
    // --------------------------------------------------------

    const moveX =
        Math.random() * 100 - 40;

    const moveY =
        120 +
        Math.random() * 40;


    const animation =
        img.animate(
            [
                {
                    transform:
                        "translate(0, 0)",

                    opacity:
                        opacity
                },

                {
                    transform:
                        `translate(${moveX}px, -${moveY}vh)`,

                    opacity: 0
                }
            ],
            {
                duration:
                    duration,

                easing:
                    "linear",

                fill:
                    "forwards"
            }
        );


    animation.onfinish =
        () => {

            if (img.parentNode) {
                img.remove();
            }
        };
}



// ============================================================
// TẠO ĐÈN LIÊN TỤC
// ============================================================

setInterval(
    createLantern,
    350
);



// ============================================================
// NÚT OK
// ============================================================

const btnOk =
    document.getElementById(
        "btn-ok"
    );


btnOk.addEventListener(
    "click",
    () => {

        inviteBox.style.display =
            "none";


        lanternClickable =
            true;


        // ----------------------------------------------------
        // Hiện hướng dẫn
        // ----------------------------------------------------

        const hint =
            document.createElement(
                "div"
            );


        hint.id =
            "hint";


        hint.textContent =
            "Biết ngay sẽ đồng ý mà\n" +
            "👆 Chạm vào đèn trời có điều bất ngờ";


        document.body.appendChild(
            hint
        );


        setTimeout(
            () => {

                hint.style.opacity =
                    "1";

            },
            50
        );


        setTimeout(
            () => {

                hint.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        if (
                            hint.parentNode
                        ) {
                            hint.remove();
                        }

                    },
                    1000
                );

            },
            5000
        );
    }
);



// ============================================================
// DỮ LIỆU
// ============================================================

const data = {

    1: {

        sentences: [
            "Cậu ơi, Trung Thu đến rồi, đi chơi với tớ nha...",
            "Em ơi, Trung thu sắp đến rồi đó...",
            "Tớ muốn cùng cậu đi dạo dưới ánh đèn lồng lung linh.",
            "Trung Thu có cậu thì mới thật sự trọn vẹn"
        ],

        wishes: [
            "Tớ chúc mọi điều tốt đẹp nhất đến với cậu.",
            "Tớ mong cậu gặp nhiều may mắn và hạnh phúc.",
            "Cậu mãi là người quan trọng với tớ.",
            "Chúc cậu luôn rạng rỡ như ánh trăng tròn."
        ],

        invite:
            "Đi chơi với tớ nhé?",

        noTexts: [
            "Không đi là tớ giận cậu đó 😭",
            "Thôi năn nỉ đó 😩",
            "Đi một lần thôi mà 😩",
            "Thôi mà, đi với tớ đi 😢"
        ]
    },


    2: {

        sentences: [
            "你 ơi, Trung Thu này 我 muốn dắt 你 đi chơi nè...",
            "Có bánh nướng, có lồng đèn, có 我 nè 😘",
            "Mình đi ăn bánh Trung Thu rồi ngắm trăng tròn 🌕",
            "我 chỉ cần 你 ở cạnh, là đủ rồi ❤️"
        ],

        wishes: [
            "Chúc em của anh luôn khỏe mạnh và vui vẻ.",
            "Chúc em của anh luôn rạng rỡ như ánh trăng.",
            "Có anh bên cạnh, trăng rằm cũng sáng hơn.",
            "Anh mong mình sẽ cùng em đi qua thật nhiều mùa trăng nữa."
        ],

        invite:
            "Đi chơi với anh nhé?",

        noTexts: [
            "Không đi với anh hả em? 🥺",
            "Thôi mà, anh buồn á 😢",
            "Thôi mà 😢",
            "Không đi là buồn á 😭"
        ]
    },


    3: {

        sentences: [
            "Anh ơi, Trung Thu này em muốn đi dạo cùng anh...",
            "Ngắm trăng, nắm tay, kể chuyện hồi nhỏ...",
            "Em muốn được ngồi cạnh anh, nghe kể chuyện xưa 😘",
            "Mình cùng nhau đi chơi nhé?"
        ],

        wishes: [
            "Mong em luôn mạnh khỏe và hạnh phúc.",
            "Ước mơ của em sẽ bay cao, sáng như ánh trăng rằm.",
            "Anh chính là niềm vui lớn nhất của em.",
            "Chúc em có một đêm Trung Thu thật ấm áp và tràn ngập tiếng cười."
        ],

        invite:
            "Đi chơi với em nhé?",

        noTexts: [
            "Anh không đi cùng em thật sao? 🥺",
            "Thôi mà, đi với em nha 😢",
            "Em muốn đi với anh lắm á 😩",
            "Cậu không đi thật hả? 🥺"
        ]
    },


    4: {

        sentences: [
            "em ơi, Trung Thu này mình ra ngoài dạo phố nhé...",
            "Mình đi ăn bánh dẻo, ngắm đèn hoa đăng?",
            "Có bánh nướng, có lồng đèn, có anh nè 😘",
            "Có em bên cạnh, anh thấy Trung Thu nào cũng đẹp."
        ],

        wishes: [
            "Chúc em của anh luôn khỏe mạnh và vui vẻ.",
            "Mong công việc and học tập của em luôn thuận lợi.",
            "Chúc em có nhiều niềm vui như ánh đèn lồng kia.",
            "Có em bên cạnh, Trung Thu của anh mới thật sự hạnh phúc."
        ],

        invite:
            "Đi chơi với em nhé?",

        noTexts: [
            "Không đi với em hả anh? 🥺",
            "Thôi mà, đi với em nha 😢",
            "Đi với anh đi mà 😢",
            "Không đi là em giận đó 😭"
        ]
    },


    5: {

        sentences: [
            "em ơi, Trung Thu này anh muốn dắt em đi chơi nè...",
            "anh muốn nhìn thấy nụ cười của em trong ánh đèn lồng 🌟",
            "Có bánh nướng, có lồng đèn, có anh nè 😘",
            "Có anh bên cạnh, trăng rằm cũng sáng hơn."
        ],

        wishes: [
            "Mong em luôn gặp nhiều may mắn và hạnh phúc.",
            "Mong em luôn an yên và hạnh phúc.",
            "em yêu anh nhiều lắm, mãi bên nhau nha!",
            "Chúc em của anh luôn rạng rỡ như ánh trăng."
        ],

        invite:
            "Đi chơi với em nhé?",

        noTexts: [
            "Không đi với em hả anh? 🥺",
            "Đi với anh đi mà 😢",
            "Thôi mà, em buồn á 😢",
            "Nếu em không đi, anh buồn lắm 😭"
        ]
    }
};



// ============================================================
// LẤY ID TRÊN URL
// Ví dụ: index.html?id=2
// ============================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const id =
    params.get("id") || "2";


const selectedData =
    data[id] || data[2];


const sentences =
    selectedData.sentences;

const wishes =
    selectedData.wishes;

const invite =
    selectedData.invite;

const noTexts =
    selectedData.noTexts;



// ============================================================
// CÂU HỎI
// ============================================================

const inviteText =
    inviteBox.querySelector("p");


if (inviteText) {

    inviteText.textContent =
        invite;
}



// ============================================================
// BẮT ĐẦU CHẠY CHỮ
// ============================================================

messageBox.style.display =
    "flex";


showSentence(
    sentences[currentSentence]
);



// ============================================================
// NÚT KHÔNG
// ============================================================

const btnNo =
    document.getElementById(
        "btn-no"
    );


btnNo.addEventListener(
    "click",
    () => {

        btnNo.classList.add(
            "shake"
        );


        btnNo.textContent =
            noTexts[noTextIndex];


        noTextIndex =
            (noTextIndex + 1)
            % noTexts.length;


        setTimeout(
            () => {

                btnNo.classList.remove(
                    "shake"
                );

            },
            500
        );
    }
);



// ============================================================
// ĐẢM BẢO CONTAINER ĐÈN CÓ THỂ NHẬN SỰ KIỆN
// ============================================================

lanternContainer.style.pointerEvents =
    "auto";


// ============================================================
// TẠO MỘT SỐ ĐÈN BAN ĐẦU
// để sau khi bấm OK luôn có đèn để chạm
// ============================================================

for (let i = 0; i < 8; i++) {

    setTimeout(
        () => {
            createLantern();
        },
        i * 250
    );
}

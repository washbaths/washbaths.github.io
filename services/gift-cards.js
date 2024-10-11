const SQUARE_CONFIG = {
  locationId: "LZMWJADGEGMEQ",
};

const OPTIONS_CONFIG = {
  single: {
    url: "https://square.link/u/GB39mKzF",
    amount: 36,
  },
  fivePass: {
    url: "https://square.link/u/khDO9CE5",
    amount: 155,
  },
  tenPass: {
    url: "https://square.link/u/oT3RqjIB",
    amount: 290,
  },
  fiftyDollar: {
    url: "https://square.link/u/fsfdmHkU",
    amount: 50,
  },
  custom: {
    url: "#",
    amount: 0,
  },
};

const createPayButton = (option) => {
  const seat = document.getElementById("payment-button-area");
  const butt = document.createElement("a");
  butt.setAttribute("class", "pay-button");
  butt.setAttribute("target", "_blank");
  butt.setAttribute("rel", "nooopener noreferrer");
  butt.setAttribute("href", OPTIONS_CONFIG[option].url);
  butt.innerText = `Pay $${OPTIONS_CONFIG[option].amount}.00`;
  seat.replaceChildren(butt);
  seat.style.display = "block";
};

const getCustomLink = async (amount) => {
  // implement square link creation here
  const response = await fetch(
    "https://abwcljjy6usvqqtehogspljqb40mvvtt.lambda-url.us-east-1.on.aws/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // this shows the expected content type
      },
      body: JSON.stringify({
        locationId: SQUARE_CONFIG.locationId,
        amount: parseInt(amount) * 100, // in cents
      }),
    }
  );
  const responseParsed = await response.json();
  return responseParsed.url;
};

let fetchingLink = false;

const clickCustom = async (e) => {
  e.preventDefault();
  if (fetchingLink) return;
  const amount = document.getElementById("custom-amount").value;
  if (amount > 0) {
    const seat = document.getElementById("payment-button-area");
    const newDiv = document.createElement("div");
    newDiv.innerText = `...Creating custom checkout for $${amount}`;
    seat.appendChild(newDiv);
    fetchingLink = true;
    const link = await getCustomLink(amount);
    newDiv.innerText = "";
    const butt = document.createElement("a");
    butt.setAttribute("class", "pay-button");
    butt.setAttribute("target", "_blank");
    butt.setAttribute("rel", "nooopener noreferrer");
    butt.setAttribute("href", link);
    butt.innerText = `Pay $${amount}`;
    // give the api a third sec
    setTimeout(() => {
      newDiv.replaceChildren(butt);
      fetchingLink = false;
    }, 333);
  }
};

const updateAmount = (e) => {
  const butt = document.getElementById("payment-button-area").firstChild;
  if (e.target.value >= 1) {
    butt.innerText = `Create $${e.target.value} custom checkout link`;
    document.getElementById("payment-button-area").style.display = "block";
  } else {
    document.getElementById("payment-button-area").style.display = "none";
  }
};

const createInputField = async () => {
  document.getElementById("custom-amount-area").style.display = "flex";
  document.getElementById("custom-amount-area").style.flexDirection = "column";
  document.getElementById("custom-amount-area").style.alignItems = "center";
  const inputAmount = document.getElementById("custom-amount");
  inputAmount.value = "";
  inputAmount.addEventListener("keyup", updateAmount);
  const seat = document.getElementById("payment-button-area");
  const butt = document.createElement("a");
  butt.setAttribute("class", "pay-button");
  butt.setAttribute("target", "_blank");
  butt.setAttribute("rel", "nooopener noreferrer");
  butt.setAttribute("href", "#");
  butt.innerText = "Create $0 custom checkout link";
  seat.replaceChildren(butt);
  seat.style.display = "block";
  butt.addEventListener("click", clickCustom);
};

const listenToDropdown = (e) => {
  if (["single", "fivePass", "tenPass", "fiftyDollar"].includes(e.target.value)) {
    document.getElementById("custom-amount-area").style.display = "none";
    createPayButton(e.target.value);
  } else if (e.target.value === "custom") {
    createInputField();
    document.getElementById("payment-button-area").style.display = "none";
  } else if (e.target.value === "none") {
    document.getElementById("custom-amount-area").style.display = "none";
    document.getElementById("payment-button-area").style.display = "none";
  }
};

// setup listeners
document
  .getElementById("top-drop")
  .addEventListener("change", listenToDropdown);

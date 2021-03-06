const main = () => {
	const navContainer = document.querySelector("header nav"); // Use in 3 Function

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("./service-worker.js")
			.then(() => console.log("Service Worker Active"))
			.catch((err) => console.log("Registration Failed", err));
	}

	const spaActivation = () => {
		let page = window.location.hash.substr(1);
		if (page == "") page = "home";

		document.addEventListener("click", (e) => {
			if (e.target.classList.contains("all-portfolio") || e.target.classList.contains("all-certificate")) {
				page = e.target.getAttribute("href").substr(1);
				if (page != "home") setBackToHome();
				data();
			}
		});

		const setBackToHome = () => {
			const navigation = document.querySelectorAll("nav ul li a");
			navigation.forEach((e) => e.addEventListener("click", () => (window.location.href = "./index.html")));
		};

		const loadPage = (page) => {
			return fetch(page).then((res) => {
				if (res.status === 200) return res.text();
				else if (res.status === 404) return error404();
				return errorRender();
			});
		};

		const keepNavbarBlack = () => {
			navContainer.classList.add("black");
			window.addEventListener("scroll", () => {
				if (pageYOffset <= 30) navContainer.classList.add("black");
			});
		};

		const error404 = () => {
			keepNavbarBlack();
			return `<div class="error-404 d-flex justify-content-center align-items-center flex-column">
					<img src="./img/undraw_page_not_found_su7k.svg" alt="img-error-404" />
					<p class="mt-3 bold">Page Not Found</p>
				</div>`;
		};

		const errorRender = () => {
			keepNavbarBlack();
			return `<div class="error-404 d-flex justify-content-center align-items-center flex-column">
					<img src="./img/undraw_page_not_found_su7k.svg" alt="img-error-render" />
					<p class="mt-3 bold">OOPS. Something Wrong :(</p>
				</div>`;
		};

		const errorFetch = (err) => {
			keepNavbarBlack();
			return `<div class="error-404 d-flex justify-content-center align-items-center flex-column">
					<img src="./img/undraw_server_down_s4lk.svg" alt="img-error-fetch" />
					<p class="mt-3 bold">OOPS. ${err}</p>
				</div>`;
		};

		const data = async () => {
			const pageContainer = document.querySelector(".pages-render");
			try {
				const pages = await loadPage(`./pages/${page}.html`);
				window.scrollTo(0, 0);
				pageContainer.innerHTML = pages;
			} catch (err) {
				window.scrollTo(0, 0);
				pageContainer.innerHTML = errorFetch(err);
			}
		};
		if (page !== "home") setBackToHome();
		data();
	};
	spaActivation();

	const smoothScroll = () => {
		setTimeout(() => {
			$(".page-scroll").on("click", function (e) {
				// ambil isi href
				let tujuan = $(this).attr("href");
				// tangkap elemen ybs
				let elemenTujuan = $(tujuan);

				// pindahkan scroll
				$("html,body").animate(
					{
						scrollTop: elemenTujuan.offset().top - 100,
					},
					950,
					"easeInOutExpo"
				);

				e.preventDefault();
			});
		}, 2000);
	};
	smoothScroll();

	if (!document.querySelector(".img-loading")) console.log("hai");

	function navigation() {
		const bodyOverlay = document.querySelector(".body-overlay");
		const burgerDiv = document.querySelectorAll(".burger div");
		const ul = document.querySelector("header nav ul");
		const li = document.querySelectorAll("header nav ul li");

		let burger = document.querySelector(".burger");
		burger.addEventListener("click", function () {
			bodyOverlay.classList.toggle("active");
			ul.classList.toggle("nav-active");
			this.classList.toggle("toggle");
			li.forEach((links, index) => (links.style.animation ? (links.style.animation = "") : (links.style.animation = "liFadeIn 0.2s ease forwards " + index / 8 + "s")));
			burgerDiv.forEach((e) => e.classList.toggle("active"));
		});

		window.addEventListener("scroll", () => (pageYOffset >= 30 ? navContainer.classList.add("black") : navContainer.classList.remove("black")));
	}
	navigation();

	function buttonToTop() {
		const button = document.getElementById("button-to-top");
		window.addEventListener("scroll", () => (pageYOffset > 800 ? button.classList.add("show") : button.classList.remove("show")));
	}
	buttonToTop();

	function loading() {
		const containerImgLoading = document.querySelector(".img-loading");
		const body = document.querySelector("body");
		const bodyOverlay = document.querySelector(".body-overlay");
		const offlinePopup = document.querySelector(".offline-popup");
		const section = document.querySelectorAll("section");
		const footer = document.querySelector("footer");
		const header = document.querySelector("header");
		const pagesRender = document.querySelector(".pages-render");
		const allSection = [body, bodyOverlay, offlinePopup, footer, header, pagesRender];

		section.forEach((e) => allSection.push(e));
		allSection.map((e) => e.classList.add("loading"));

		window.addEventListener("load", () => {
			containerImgLoading.classList.add("loaded");
			setTimeout(() => {
				containerImgLoading.remove();
				allSection.map((e) => e.classList.remove("loading"));
			}, 700);
		});
	}
	loading();

	const seeMoreTools = () => {
		if (document.querySelector(".expertness")) {
			const seeMoreToolsText = document.querySelector(".see-tools");
			const toolsHeading = document.querySelector(".row:nth-child(4)");
			const toolsContainer = document.querySelector(".tools-container");
			seeMoreToolsText.addEventListener("click", function () {
				this.style.display = "none";
				toolsHeading.style.display = "block";
				toolsContainer.style.display = "flex";
				setTimeout(() => {
					document.querySelector(".figma-tools").style.width = "60%";
					document.querySelector(".adobeXD-tools").style.width = "60%";
					document.querySelector(".vegas-tools").style.width = "60%";
					document.querySelector(".coreldraw-tools").style.width = "40%";
					document.querySelector(".sketchup-tools").style.width = "60%";
				}, 100);
			});
		}
	};

	setTimeout(() => seeMoreTools(), 2000);

	const userWhenOnlineOffline = () => {
		const bodyOverlay = document.querySelector(".body-overlay");
		const onlinePopup = document.querySelector(".online-popup");
		const offlinePopup = document.querySelector(".offline-popup");

		const showPopup = () => {
			bodyOverlay.classList.add("active");
			offlinePopup.innerHTML = `<img src="./img/undraw_signal_searching_bhpc.svg" alt="offline-picture" />
									  <p>Opps... Your Device is Offline</p>
									  <button class="btn-keep-stay">Keep Me Stay</button>`;
			offlinePopup.classList.add("active");
		};

		const hidePopup = () => {
			bodyOverlay.classList.remove("active");
			offlinePopup.classList.remove("active");
		};

		window.addEventListener("online", () => {
			hidePopup();
			onlinePopup.textContent = `You are Online`;
			onlinePopup.classList.add("active");
			setTimeout(() => onlinePopup.classList.remove("active"), 3000);
		});
		window.addEventListener("offline", () => showPopup());

		document.addEventListener("click", (e) => {
			if (e.target.classList.contains("btn-keep-stay")) e.target.addEventListener("click", hidePopup);
		});
	};
	userWhenOnlineOffline();
};

export default main;

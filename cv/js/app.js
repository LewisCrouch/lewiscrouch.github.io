const navPane = document.querySelector("#nav_pane");
let headings = { };

this.setupNavPane();
this.setupScrollspy();
this.setupAutoPageNumbering();

function setupNavPane()
{
	document.querySelectorAll(".page h1, .page h2, .page h3, .page h4").forEach((heading) =>
	{
		// Fetch the heading text and sanitize it for use as an ID
		let prefix = "heading";
		const text = heading.firstChild.nodeValue.replace(/\W/g, '_');;
		switch(heading.tagName.toLowerCase())
		{
			case "h1": prefix = "title"; break;
			case "h3": prefix = "subheading"; break;
			case "h4": prefix = "subheading2"; break;
		}
		// Set prefix based on h tag

		// Make sure that the ID is unique
		let id = `${prefix}-${text}`;
		if(document.querySelector(`#${id}`))
		{
			let count = 2;
			while(document.querySelector(`#${id}${count}`)) count++;
			id += count;
		}
		heading.setAttribute("id", id);
		
		// Store the scroll offset of the heading element for later use (scrollspy)
		headings[id] = getOffsetTop(heading);

		// Create the nav pane link and add it to the nav pane
		const li = document.createElement("li");
		const a = document.createElement("a");
		a.classList.add(prefix);
		a.setAttribute("href", `#${id}`);
		a.setAttribute("title", heading.firstChild.nodeValue);
		a.textContent = heading.firstChild.nodeValue;
		a.addEventListener("click", () =>
		{
			highlightCurrentHeading();
		});
		li.appendChild(a);
		navPane.appendChild(li);
	});

	// Add expand / collapse toggle functionality to the nav pane when the nav button is clicked
	let navButton = document.querySelector("#nav_button");
	let navPaneContainer = document.querySelector("#nav_pane_container");
	navButton.addEventListener("click", (e, el) =>
	{
		navButton.dataset["expanded"] === "true" ? navButton.dataset["expanded"] = "false" : navButton.dataset["expanded"] = "true";

		if(navPaneContainer.classList.contains("nav-pane-container-expanded")) navPaneContainer.classList.remove("nav-pane-container-expanded");
		else navPaneContainer.classList.add("nav-pane-container-expanded");

		//if(navButton.dataset["expanded"] === "false") navPane.classList.add("d-none");
		//else navPane.classList.remove("d-none");
	})

	navButton.dataset["expanded"] = "true";
	navPaneContainer.classList.add("nav-pane-container-expanded");
}

function setupScrollspy()
{
	window.addEventListener("scroll", () =>
	{
		highlightCurrentHeading();
	});
}

function setupAutoPageNumbering()
{
	let i = 1;
	let pageNumberEls = document.querySelectorAll(".page-number");
	pageNumberEls.forEach((el) =>
	{
		el.textContent = `${i++} of ${pageNumberEls.length}`;
	});
}

/* Helper functions */

function highlightCurrentHeading()
{
	let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
	for(let i in headings)
	{
		if (headings[i] <= scrollPosition)
		{
			disableNavPaneActiveLink();
			document.querySelector(`a[href*=${i}]`).classList.add("active");
		}
	}
}

function disableNavPaneActiveLink()
{
	navPane.querySelectorAll("a").forEach((otherItem) =>
	{
		otherItem.classList.remove("active");
	});
}

function getOffsetTop(element)
{
	let offsetTop = 0;
	while(element)
	{
		offsetTop += element.offsetTop;
		element = element.offsetParent;
	}
	return offsetTop;
}
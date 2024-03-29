import React, { useEffect } from 'react';


const MyComponent = () => {
	useEffect(() => {
		const gumroadEmbedScript = document.createElement('script');
		gumroadEmbedScript.src = 'https://gumroad.com/js/gumroad-embed.js';
		gumroadEmbedScript.async = true;
		document.body.appendChild(gumroadEmbedScript);

		const gumroadScript = document.createElement('script');
		gumroadScript.src = 'https://gumroad.com/js/gumroad.js';
		gumroadScript.async = true;
		document.body.appendChild(gumroadScript);
	}, []);

	return (
		<div>
			<div className="gumroad-product-embed"></div>
		</div>
	);
};

export default MyComponent;
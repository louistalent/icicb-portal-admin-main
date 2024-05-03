import React from 'react';
export interface ImageProps {
	color? :  string
	width? :  number,
	height? :  number,
}
const ICICB = ({ width, height, color } : ImageProps)=>(
	<svg viewBox="0 0 512 512" width = {width || 25} height = {height || 25}>
		<defs>
			<linearGradient id="grd1" gradientUnits="userSpaceOnUse"  x1="-349.6" y1="241.2" x2="320.5" y2="-152">
				<stop offset = {0} stopColor = {color || "#a18959"}  />
				<stop offset = {0.1} stopColor = {color || "#eecf89"}  />
				<stop offset = {.3} stopColor = {color || "#976224"}  />
				<stop offset = {.7} stopColor = {color || "#efd58d"}  />
				<stop offset = {1} stopColor = {color || "#81693e"}  />
			</linearGradient>
		</defs>
		<path fill="url(#grd1)" d="m342.3 275.67c-18.6-11.93-57.13-29.48-115.58-52.66c-103.09-44.11-145.42-116.33-126.99-216.67c-3.55 86.79 43.96 149.78 142.54 188.97c53.4 19.26 94.98 40.23 124.74 62.9c31.53 19.13 38.8 51.37 21.79 96.71c3.01-33.2-12.49-59.62-46.5-79.25zm28.03-32.49c25.52-40.75 60.94-51.83 106.26-33.23c-19.59 5.73-33.43 23.74-41.54 54.01c-3.76 21.77-12.47 41.26-26.12 58.47c3.76-34.83-9.11-61.24-38.6-79.25zm-32.42 75.88c-12.59-8.49-38.22-20.32-76.91-35.47c-84.76-31.09-128.25-72.32-130.46-123.68c0.71 27.45 47.12 58.1 139.22 91.93c97.25 32.06 130.77 76.92 100.57 134.57c5.72-39.05-15.28-55.8-32.42-67.35zm-153.17-62.44c17.09 16.65 50.62 33.75 100.57 51.28c52.87 15.94 77.84 39.59 74.92 70.94c-18.33 102.03-151.04 97.24-156.62 97.24c-85.29-6.64-140.42 3.32-165.4 29.89c12.76-48.36 62.84-68.02 150.25-58.99c78.12 12.49 126.61-5.84 145.47-54.99c9.56-21.65-1.6-38-33.48-49.03c-32.15-8.84-56.9-18.49-74.27-28.95c-30.82-19.39-40.38-45.44-41.44-57.39zm-58.81 141.86c16.21-34.57 51.05-42.66 104.52-24.3c44.28 15.94 74.93 20.01 91.94 12.23c-9.97 18.85-44.27 20.44-102.88 4.78c-39.43-10.26-70.62-7.83-93.58 7.29zm-49.82 51.86c21.86-41.87 60.34-57.13 115.44-45.79c82.65 17.02 104.98 6.81 119.91 4.46c-20.26 23.5-60.5 30.66-120.72 21.47c-40.77-9.18-78.99-2.56-114.63 19.86z" />
	</svg>
)

const BTC = ({ width, height} : ImageProps)=>(
	<svg  viewBox="0 0 32 32" width = {width || 25} height = {height || 25}><g fill="none" fillRule="evenodd"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path fill="#FFF" fillRule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/></g></svg>
)

const ETH = ({ width, height} : ImageProps)=>(
	<svg  viewBox="0 0 32 32" width = {width || 25} height = {height || 25}><g ><circle cx="16" cy="16" r="16" fill="#627EEA"/><g fill="#FFF" ><path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.028L9 17.616z"/><path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></g></svg>
)
const USDT = ({ width, height} : ImageProps)=>(
	<svg  viewBox="0 0 32 32" width = {width || 25} height = {height || 25}><g fill="none" fillRule="evenodd"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path fill="#FFF" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"/></g></svg>
)

const BNB = ({ width, height} : ImageProps)=>(
	<svg  viewBox="0 0 32 32" width = {width || 25} height = {height || 25}><g fill="none"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"/></g></svg>
)

const LTC = ({ width, height} : ImageProps)=>(
	<svg width={width || 24} height={height || 24} viewBox="0.847 0.876 329.256 329.256"><path d="M330.102 165.503c0 90.922-73.705 164.629-164.626 164.629C74.554 330.132.848 256.425.848 165.503.848 74.582 74.554.876 165.476.876c90.92 0 164.626 73.706 164.626 164.627" fill="#bebebe"/><path d="M295.15 165.505c0 71.613-58.057 129.675-129.674 129.675-71.616 0-129.677-58.062-129.677-129.675 0-71.619 58.061-129.677 129.677-129.677 71.618 0 129.674 58.057 129.674 129.677" fill="#bebebe"/><path d="M155.854 209.482l10.693-40.264 25.316-9.249 6.297-23.663-.215-.587-24.92 9.104 17.955-67.608h-50.921l-23.481 88.23-19.605 7.162-6.478 24.395 19.59-7.156-13.839 51.998h135.521l8.688-32.362h-84.601" fill="#fff"/></svg>
)
const arrow = ({ width, height, color } : ImageProps)=>(
	<svg version="1.1"  viewBox="0 0 960 960" width = {width || 20} height = {height || 20}>
		<g>
			<path fill = {color || "currentColor"}  d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937
				c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937
				c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"/>
		</g>
	</svg> 
) 


const copy = ({ width, height, color } : ImageProps)=>(
	<svg viewBox="0 0 64 64" width = {width || 20} height = {height || 20}>
		<g>
			<path fill = {color || "currentColor"}  d="M56.34 17.27C56.2654 17.1214 56.1712 16.9835 56.06 16.86L42.13 2.94C41.8438 2.66648 41.4658 2.50958 41.07 2.5H20.92C19.6159 2.50264 18.3661 3.02185 17.444 3.94395C16.5218 4.86606 16.0026 6.11595 16 7.42V10.62H12.42C11.1159 10.6226 9.86606 11.1418 8.94395 12.064C8.02185 12.9861 7.50264 14.2359 7.5 15.54V56.54C7.50264 57.8441 8.02185 59.0939 8.94395 60.016C9.86606 60.9382 11.1159 61.4574 12.42 61.46H43.08C44.3772 61.4574 45.6211 60.9437 46.542 60.0302C47.463 59.1168 47.9868 57.8771 48 56.58V53.38H51.58C52.8841 53.3774 54.1339 52.8582 55.056 51.936C55.9782 51.0139 56.4974 49.7641 56.5 48.46V17.93C56.4993 17.7005 56.4445 17.4744 56.34 17.27V17.27ZM42.57 7.62L51.38 16.42H42.57V7.62ZM45 56.62C45 57.1292 44.7977 57.6176 44.4376 57.9776C44.0776 58.3377 43.5892 58.54 43.08 58.54H12.42C11.9108 58.54 11.4224 58.3377 11.0624 57.9776C10.7023 57.6176 10.5 57.1292 10.5 56.62V15.62C10.5 15.1108 10.7023 14.6224 11.0624 14.2624C11.4224 13.9023 11.9108 13.7 12.42 13.7H16V48.46C16.0026 49.7641 16.5218 51.0139 17.444 51.936C18.3661 52.8582 19.6159 53.3774 20.92 53.38H45V56.62Z"/>
		</g>
	</svg> 
)


export default { 
	ICICB,
	BTC,
	ETH,
	USDT,
	BNB,
	LTC,
	arrow,
	copy
}

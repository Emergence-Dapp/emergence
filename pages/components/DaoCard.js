
export const DaoCard = ({data}) => {
    return (
        <div className="grid place-items-center bg-gray-400 antialiased text-gray-900" style={{ 'height':'60vh',}}>
            <div>
                <img src="https://source.unsplash.com/random/350x350" alt=" random imgee" className="w-full object-cover object-center rounded-lg shadow-md" /> 
                <div className="relative px-4 -mt-16 ">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-baseline">
                            <span className="bg-teal-200 text-teal-800 text-s px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
                                {data.status}
                            </span>
                            {/* <div className="ml-2 text-gray-600 uppercase text-s font-semibold tracking-wider">
                                Active  &bull; 3 rooms
                            </div>                             
                            */}
                        </div>
                        <h4 className="mt-1 text-2xl font-semibold uppercase leading-tight truncate">{data.name}</h4>
                        <div className="mt-1">
                        {data.description}
                        </div>
                        {/* <div className="mt-4">
                            <span className="text-teal-600 text-md font-semibold">4/5 ratings </span>
                            <span className="text-sm text-gray-600">(based on 234 ratings)</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
import { Header } from "../../components/Header";
import { RoomCard } from "../../components/RoomCard";
import roomData from '../../data/rooms.json';
import { useRouter } from 'next/router'

export default function RoomListPage() {

    const router = useRouter()
    const { daoId } = router.query

    return (
        <div>
            <Header />
            <div className="mx-4">
                <div className="grid grid-cols-3">
                {/* justify-center */}
                {/* grid grid-cols-3 gap-x-4 gap-y-0 bg-gray-400 */}
                {/* grid grid-flow-row-dense grid-cols-3  */}
                {roomData.map( (item, index) => {
                    return <RoomCard data={item} />
                } ) }    
                </div>   
            </div>     
        </div>
    );
}
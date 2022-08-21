import { Header } from '../../components/Header'
import { RoomCard } from '../../components/RoomCard'
import roomData from '../../data/rooms.json'

export default function RoomListPage() {
  return (
    <div>
      <Header />
      <div className="mx-4">
        <div className="grid grid-cols-3 mt-20">
          {/* justify-center */}
          {/* grid grid-cols-3 gap-x-4 gap-y-0 bg-gray-400 */}
          {/* grid grid-flow-row-dense grid-cols-3  */}
          {roomData.map((item, index) => {
            return <RoomCard key={index} data={item} />
          })}
        </div>
      </div>
    </div>
  )
}

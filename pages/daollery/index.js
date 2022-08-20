import { Header } from "../components/Header";
import { DaoCard } from "../components/DaoCard";
import daoData from '../../data/daos.json';

console.log("daoData:", daoData);

export default function DaolleryPage() {
    return (
        <div>
            <Header />
            <div className="grid grid-flow-row-dense grid-cols-3 ">
            {daoData.map( (item, index) => {
                return <DaoCard data={item} />
            } ) }    
            </div>        
        </div>
    );
}
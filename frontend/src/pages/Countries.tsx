import { useEffect, useState } from 'react';
import api from '../api';

type Country = {
  name:string; capital:string; currency:string; languages:string[]; flag:string;
};

export default function Countries(){
  const [data,setData] = useState<Country[]>([]);
  useEffect(()=>{
    api.get<Country[]>('/countries').then(r=>setData(r.data));
  },[]);
  return (
    <div className="container">
      <h2>Countries</h2>
      <table className="table">
        <thead><tr>
          {['Country','Capital','Currency','Languages','Flag'].map(h=> <th key={h}>{h}</th>)}
        </tr></thead>
        <tbody>
          {data.map(c=>(
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.capital}</td>
              <td>{c.currency}</td>
              <td>{c.languages.join(', ')}</td>
              <td><img src={c.flag} width={40}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
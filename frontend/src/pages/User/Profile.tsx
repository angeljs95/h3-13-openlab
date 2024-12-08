import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "../../store/store";
import { items, profile, sumIcon } from "../../assets";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import SimpleBar from 'simplebar-react';
import "../../index.css"
import 'simplebar/dist/simplebar.min.css';
import GrafEther from "../../components/graf/Cryptos/Etherium";
import EditOrders from "../../components/orders/editOrders";
import CreateOrders from "../../components/orders/createOrders";
import UncancelNoti from "../../components/notifications/uncancelNoti";
import CancelNoti from "../../components/notifications/cancelNoti";
import DeleteNoti from "../../components/notifications/deleteNoti";
import { StatisticsProfile } from "../../components/stats/stadistics";
import { obtenerPreciosCripto } from "../../components/hooks/CryptoData";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { caipNetwork } = useAppKitNetwork();
  const { address, isConnected } = useAppKitAccount();
  const [balanceETH, setBalanceETH] = useState<string | null>(null);
  const {sells , buys} =useSelector((state:RootState) => state.ordersBooks);
  const [active, setActive] = useState<'Sells' | 'Buys'>('Buys');
  const provider = caipNetwork ? new ethers.providers.JsonRpcProvider(caipNetwork.rpcUrls.default.http[0]) : null;

  const fetchData = async () => {
    if (!address || !provider) return;

    try {
      const balanceInWei = await provider.getBalance(address);
      const balanceInEther = ethers.utils.formatEther(balanceInWei);
      setBalanceETH(balanceInEther);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  const [precios, setPrecios] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [modalCreate , setModalCreate]= useState(false);
  const [modalEdit , setModalEdit] = useState(false);
  const [editOrder , setEditOrder] = useState(null)
  const [modalType, setModalType] = useState< 'edit' | 'cancel' | 'uncancel' | 'delete' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      fetchData();
    }
    const obtenerPrecios = async () => {
      try {
        const preciosConImagenes = await obtenerPreciosCripto(); 
        setPrecios(preciosConImagenes);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
    obtenerPrecios();
  }, [isConnected, address, caipNetwork]);

  if (loading) {
    return <div className="flex items-center flex-col justify-center h-[40em] bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    <p className="p-2">Cargando...</p>
  </div>;
  }

  if (error) {
    return <div>Error:{error}</div>;
  }

  const handleButtonClick = (button: 'Sells' | 'Buys') => {
    setActive(button);
  };
  
  const handleCreate = () =>{
    setModalCreate(true)
  }


  const handleEdit = (order: any) => {
    setEditOrder(order);
    setModalEdit(true);
  };

  const openNoti = (type: 'cancel' | 'uncancel' | 'delete', orderId: string) => {
    setModalType(type);
    setOrderId(orderId);
  };

  const closeNoti = () => {
    setModalType(null);
    setOrderId(null);
  };
  
  const filterOrders = (active==="Buys"? buys : sells)

  return (
    <div className="bg-[#afafaf1a]/10 p-3">
      {modalEdit && editOrder && <EditOrders order={editOrder}  onClose={() => setModalEdit(false)} type={active}/>}
      {modalCreate && <CreateOrders onClose={() => setModalCreate(false)}/>}
      {modalType === 'cancel' && <CancelNoti orderId={orderId!} type={active} onClose={closeNoti} />}
      {modalType === 'uncancel' && <UncancelNoti orderId={orderId!} type={active}  onClose={closeNoti} />}
      {modalType === 'delete' && <DeleteNoti orderId={orderId!} type={active}  onClose={closeNoti} />}
      <h1 className="text-3xl p-1">Profile</h1>
      <div className="p-3 flex flex-col bg-white shadow-lg rounded-lg">
        <div className="flex flex-row gap-3 m-[1em]">
          <img src={profile} alt="user" className="w-16" />
          <div className="flex flex-col">
            <h1 className="font-semibold">
              {user?.name} {user?.lastName}
            </h1>
            <h2>{user?.email}</h2>
          </div>
        </div>

        <div className="flex flex-row justify-evenly">
          <div className="flex flex-row justify-around gap-4 ">
            <div className="flex flex-col gap-3 p-1">
              <h1 className="text-lg font-semibold">Estimated balance</h1>
              <h2 className="font-semibold text-xl">{balanceETH} ETH</h2>
              <h3>= ${balanceETH && precios.Ethereum?.usd ? (parseFloat(balanceETH) / precios.Ethereum?.usd).toFixed(4) : 'Cargando...'}</h3>
              <div className="flex flex-row w-[22em] justify-between">
                <div className="flex flex-row">
                  <img src={precios.Ethereum?.image} alt="crypto" className="w-9 h-9 m-2"/>
                  <span className="font-semibold">
                      Etherium
                      <h2 className="font-normal text-sm opacity-60">{precios.Ethereum?.symbol.toUpperCase()}</h2>
                  </span>
                </div>
                <div className="flex flex-col ">
                  <span className="font-semibold text-l text-color-1">{precios.Ethereum?.porcentage ? precios.Ethereum?.porcentage.toFixed(2)+"%" : 'Cargando...'}</span>
                  <span className="opacity-60">  ${precios.Ethereum?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[25em] flex flex-col items-center">
            <GrafEther/>
          </div>
        <div className="w-[25em]">
          <ul>
            {user?.tags.map((item) =>(
              <li className="flex flex-row m-3 text-lg font-semibold">
                <img src={items} className="mr-4"/>
                {item.role} at {item.dao}
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
        
      <div className="flex flex-row">
        <div className="flex flex-col w-[48em] bg-white shadow-lg rounded-lg pl-[em]">
          <SimpleBar style={{ maxHeight: 500 }}>
            <ul>
              {Object.keys(precios).map((cryptoKey) => (
                <li key={cryptoKey} className="flex items-center gap-3 flex-row  justify-between m-3">
                  <div className="flex flex-row">
                    <img
                      src={precios[cryptoKey]?.image}
                      alt={`${cryptoKey} logo`}
                      className="w-9 h-9 m-2"
                    />
                    <span className="font-semibold">
                      {cryptoKey}
                      <h2 className="font-normal text-sm opacity-60">{precios[cryptoKey]?.symbol.toUpperCase()}</h2>
                    </span>
                  </div>
                  <div className="flex flex-col items-end mr-8">
                    <span className="font-semibold text-l text-color-1">{precios[cryptoKey]?.porcentage ? precios[cryptoKey]?.porcentage.toFixed(2)+"%" : 'Cargando...'}</span>
                    <span className="opacity-60">  ${precios[cryptoKey]?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </li>
              ))}
            </ul>
            </SimpleBar>
        </div>
          
         <StatisticsProfile/>

      </div>
              <br/>
      <div className="flex flex-col w-[82em] m-auto h-[30em] pt-4 bg-white shadow-lg rounded-lg"
      >
        <h1 className="text-xl p-2 ml-[2em] font-semibold">Purchase and Sale Orders</h1>
        
          <div className="flex flex-row mb-2 justify-items-end self-end gap-2 mr-10">
              <button 
              className="w-[8em] flex items-center justify-center bg-color-5 text-white text-sm font-semibold p-1 gap-6 rounded-lg"
              onClick={handleCreate}>
                <img src={sumIcon}/>Create
                </button>
            <button
            className={`text-sm font-semibold p-3 w-[116px]  ${
              active === 'Buys' ? 'text-color-1 shadow border border-color-1 rounded-lg' : 'text-black'
            }`}
            onClick={() => handleButtonClick('Buys')}>
              Buys</button>
            <button
            className={`text-sm font-semibold w-[116px] p-3 ${
              active=== 'Sells' ? 'text-color-1 shadow border border-color-1 rounded-lg' : 'text-black'
            }`}
            onClick={() => handleButtonClick('Sells')}>
              Sells</button>
        </div>
        
        <div className="flex flex-col pt-2 pl-8 pr-8 w-[80em]">
          <SimpleBar style={{ maxHeight: 500 }}>
          <div className="grid grid-cols-8 grid-rows-1 h-[4em] w-[76em] text-center text-base font-semibold items-center bg-[#00B2FF]/10">
              <div >    </div>
              <div >Name</div>
              <div >Tokens</div>
              <div >Price</div>
              <div className="col-span-2">    </div>
              <div className="col-start-7">   </div>
              <div className="col-start-8">   </div>
          </div>
          {filterOrders.map((order)=>(
          <div className="grid grid-cols-8 grid-rows-1 bg-white w-[74em] text-center justify-center  items-center border-b border-gray-200 h-[4em] ">
              <div className=" items-center" key={order.id}><img src={order.logoDao} className="w-8 h-8 m-auto"/></div>
              <div className="  ml-[1em] text-base">{order.tokenDao}</div>
              <div className="  ml-[1em] text-base">{order.quantity}</div>
              <div className="  ml-[1.5em] text-base font-semibold">$ {order.price}</div>
              <div className="col-span-2">  </div>
              {order.state === true 
                ? <>
                <div className="col-start-8 flex flex-row gap-3 justify-center ">
                  <button  onClick={() => openNoti('cancel', order.id)}
                  className="bg-color-1 text-white p-2 rounded-lg shadow "
                  >Cancel</button>
                  <button onClick={() => handleEdit(order)}
                   className="bg-[#00B2FF] text-white p-2 rounded-lg shadow "
                  >Edit</button>
                  <button onClick={() => openNoti('delete', order.id)}
                  className="bg-black text-white p-2 rounded-lg shadow "
                  >Delete</button></div>
                </>
                : <>
                <div className="col-start-8 flex flex-row gap-2 justify-center ]">
                  <button onClick={() => openNoti('uncancel', order.id)}
                  className="bg-color-1/50 text-white p-2 rounded-lg shadow "
                  >Uncancel</button>
                  <button onClick={() => handleEdit(order)}
                  className="bg-[#00B2FF] text-white p-2 rounded-lg shadow "
                  >Edit</button>
                  <button onClick={() => openNoti('delete', order.id)}
                  className="bg-black text-white p-2 rounded-lg shadow "
                  >Delete</button></div>
              </>
              }
          </div>
          )
          )}
          </SimpleBar>
        </div>
    
      </div>
    </div>

  );
};

export default Profile;

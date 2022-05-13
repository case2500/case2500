import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
// import Moment from 'react-moment';
// import 'moment-timezone';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Table, Image, Badge, Spinner, Row, Col, Button } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";

function AboutPage() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [alldata, setAllData] = useState("");
    const [tmp, setTmp] = useState("");
    const [tmpsome, setTmpSome] = useState("");
    const [option, setOption] = useState(0)
    const [searchName, setSearchName] = useState("");


    useEffect(() => {
        // setLoading(true);
        // if (option === 0) {
        //     // alert(option);
        // }

        axios.get(`http://localhost:8000/order/`)

            .then(res => {
                // alert(JSON.stringify(res.data))
                setCountries(res.data);
                setLoading(false);
                var tmp = 0;
                var i;
                for (i = 0; i < res.data.length; i++) {
                    tmp = parseInt(res.data[i].price) * parseInt(res.data[i].qty) + tmp;
                }
                setTmp(tmp);
                // alert(tmp)
            })
            .catch(err => {
                console.log(err);
            });


            
    }, []);


    useEffect(() => {
        setFilteredCountries(
            countries.filter(country =>
                country.name.toLowerCase().includes(searchName.toLowerCase())
            )
        );
    

    }, [searchName, countries]);


    useEffect(() => {
        setFilteredCountries(
            countries.filter(country =>
                country.date.toLowerCase().includes(search.toLowerCase())
            )
        );
        setAllData(filteredCountries.length);

        setTimeout(() => {
            
          }, 3000);
        var tmpsome = 0;
        var i;
        for (i = 0; i < filteredCountries.length; i++) {
            tmpsome = parseInt(filteredCountries[i].price) * parseInt(filteredCountries[i].qty) + tmpsome;
        }
        setTmpSome(0);
        setTmpSome(tmpsome);
    }, [search, countries]);

    if (loading) {
        return <p>Loading ...</p>;
    }



    return (
        <div className="App">
            <div class="col-12 text-center">
                <h2>รายการค่าใช้จ่ายชมรมมิตรสัมพันธ์</h2>

            </div>
            <div onChange={e => setOption(e.target.value)}>
                <input type="radio" value="0" name="payall" />รายการทั้งหมด
            </div>

            <><h5  >ยอดรวมค้นหา{" "}<b style={{ textAlign: 'center', color: "red" }}>{tmpsome}</b> {" "} บาท {" "} ค้นหามีรายการทั้งหมด <b style={{ textAlign: 'center', color: "red" }}>{filteredCountries.length}</b>  {" "}
                รายการ</h5> {" "} รายการทั้งหมด {" "}{alldata} ยอดรวมค่าใช้จ่ายทั้งหมด {tmp} บาท {" "} </>
            <div>

                {/* {setAllData(filteredCountries.length)} */}
                <h5 > </h5>
            </div>
            {/* {filteredCountries.map((country, index) => ( */}
            <div>
                <input
                    type="text"
                    placeholder="ค้นหาวันที่ เช่น 31-03-2565"
                    onChange={e => setSearch(e.target.value)}
                />{" "}
                <input
                    type="text"
                    placeholder="ค้นหาชื่อ"
                    onChange={e => setSearchName(e.target.value)}
                />

            </div>

            <CountryDetail filteredCountries={filteredCountries} />





        </div>
    );
}
const onChangeValue = (e) => {
    // alert(e.target.value);
    // setOption(e.target.value);
}
const CountryDetail = props => {
    // const n= props.length;
    const { index, schoolname, billno, _id, date, datepay, price, part, filteredCountries } = props;


    return (
        <div className="container">
            <Table striped bordered hover  >
                <tbody>
                    {filteredCountries.map((c, index) => {
                        return (
                            <>
                                <tr key={c.id}>
                                    <td>{index + 1} </td>
                                    <td><h6>{c.name} </h6>
                                    </td>
                                    <td>
                                        {c.status > 0
                                            ? <Button className="btn  btn-primary" style={{ margin: '2px 2px 2px 2px', textAlign: 'center', width: '80px', height: '30px' }} >โอน</Button>
                                            : <Button className="btn  btn-success" style={{ textAlign: 'center', width: '80px', height: '30px' }} >สด</Button>
                                        }
                                    </td>
                                    <td style={{ textAlign: 'center' }}><h6><b>{c.price} x <b>{c.qty} </b></b></h6>
                                        <h5 style={{ textAlign: 'center', color: "red" }}>
                                        </h5>
                                    </td>

                                    <td>
                                        <Button
                                            className="ml-2"
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={async () => {
                                                const isConfirm = window.confirm('แน่ใจว่าต้องการลบข้อมูล ' + c.name )
                                                if (isConfirm === true) {
                                                    const resp = axios.delete('http://localhost:8000/order/' + c._id)
                                                    //  alert(resp.data.message)
                                                    // history.go(0)
                                                    window.location.reload();
                                                }
                                            }}
                                        >
                                            <BsTrash />
                                        </Button>
                                    </td>
                                    <td>
                                        {c.date}

                                    </td>
                                    <td>
                                        {c.createdAt}

                                    </td>
                                </tr>
                            </>
                        );
                    })}
                </tbody>
            </Table>



            <hr></hr>


            {/* <p>{schoolname}</p> */}
        </div>
    );
};




export default AboutPage;
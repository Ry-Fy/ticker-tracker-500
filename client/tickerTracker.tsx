import * as classNames from 'classnames';
import * as React from "react";
import api from "../shared/api";
import TickerCard from "./components/tickerCard";
import TickerService from "./services/tickerService";
import { Col, Icon, Input, Preloader, Row } from 'react-materialize';
import { TickerTrackerState } from "./states/tickerTrackerState";
import { ITicker as Ticker } from "../shared/ticker";

export default class TickerTracker extends React.PureComponent<{},TickerTrackerState> {
	constructor(props) {
		super(props);
		this.state = {
			tickers: new Array<Ticker>(),
			searchText: "",
			loading: true
		}
	}

	async componentDidMount() {
		const newTickers = await TickerService.getAll();
		this.setState({
			tickers: newTickers,
			loading: false
		});
	}

	handleSearchChange = (event: any) => {
		this.setState({
			searchText: event.target.value
		});
	}

	handleKeyPress = async (event: any) => {
		if (event.key !== "Enter") return;
		const { searchText } = this.state;
		
		await this.setState({
			loading: true
		});

		const newTickers = await TickerService.getFiltered(searchText);
		this.setState({
			tickers: newTickers,
			loading: false
		});
	}

	render(): JSX.Element {
		const { tickers, loading } = this.state;
		return <div>
			<h3 className={classNames("white-text")}>TickerTracker <span style={{fontSize: "1.5rem"}} className={classNames("grey-text")}>Tracking the current status of the S&P 500</span></h3>
			
			<Row className={classNames("valign-wrapper")}>
				<Col className="right-align" s={1} l={2}>
					{ loading ? <Preloader flashing size="small"/> : null }
				</Col>
				<Input 
					s={11}
					l={8}
					onChange={this.handleSearchChange}
					onKeyPress={this.handleKeyPress}
					style={{fontSize: "2rem"}}
					label="Stock Symbol Search"
					className={classNames("white-text")}>
				</Input>
				<Icon className={classNames("grey-text")}>search</Icon>
				<Col s={0} l={2}></Col>
			</Row>
			<Row>
				{ 
					tickers.map((ticker) => {
						return <Col s={12} l={6} key={ticker.symbol}>
							<TickerCard
								key={ticker.symbol}
								dayGain={ticker.dayGain}
								dayGainPct={ticker.dayGainPct}
								name={ticker.name}
								price={ticker.price}
								symbol={ticker.symbol}
							/>
						</Col>;
					})
				}
			</Row>
		</div>
	}
}
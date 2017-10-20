import * as classNames from 'classnames';
import * as React from 'react';
import { TickerCardProps } from '../props/tickerCardProps';
import { Col, Icon, Row } from 'react-materialize';

export default class TickerCard extends React.PureComponent<TickerCardProps, {}> {
	render(): JSX.Element {
		const { dayGain, dayGainPct, name, price, symbol } = this.props;
		return <Row style={{padding: "0.5rem", height: "6rem"}} className={classNames("grey", "darken-3", "z-depth-3", "white-text")}>
			<Row style={{marginBottom: "0"}}>
				<Col s={12} style={{fontSize: "1.25rem"}}>
					{name}
				</Col>
			</Row>
			<Row>
				<Col s={4} style={{fontSize: "2.5rem"}}>
					{symbol}
				</Col>
				<Col s={4} className={classNames("center-align")}>
					<Row>
						<Col s={12} style={{fontSize: "1.0rem"}}>
							Day Change
						</Col>
						<Col s={6} className={classNames("text-accent-3", { "red-text": !this.hasGains(), "green-text": this.hasGains()})}>
							<div style={{fontSize: "1.25rem"}}>
								{this.hasGains() ? "" : "-"}${Math.abs(dayGain).toFixed(2)}
							</div>
						</Col>
						<Col s={6} className={classNames("text-accent-3", { "red-text": !this.hasGains(), "green-text": this.hasGains()})}>
							<div style={{fontSize: "1.25rem"}}>{dayGainPct.toFixed(2)}%</div>
						</Col>
					</Row>
				</Col>
				<Col s={4} className={classNames("center-align")}>
					<div style={{fontSize: "2.0rem"}}>
						<span>
							${price.toFixed(2)}
						</span>
						<span style={{paddingLeft: "0.5rem"}} className={classNames("text-accent-3", { "red-text": !this.hasGains(), "green-text": this.hasGains()})}>
							<Icon style={{fontSize: "1.5rem"}}>
								{ this.hasGains() ? "trending_up" : "trending_down" }
							</Icon>
						</span>
					</div>
				</Col>
			</Row>	
		</Row>;
	}

	private hasGains() : boolean {
		return this.props.dayGain >= 0;
	}
}
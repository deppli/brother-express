var alipay = require('../../resource/config').alipay;
var model = require('../../models/model'),
	orderModel = model.Order,
	customerModel = model.Customer;

alipay.on('verify_fail', function(){
		__logger.info('emit verify_fail')
	})
	.on('create_direct_pay_by_user_trade_finished', function(req, params){
		__logger.info("alipay finished");
	})
	.on('create_direct_pay_by_user_trade_success', function(req, params){
		//trade_no //支付宝交易号
		var orderId = params.order_no;
		var alipayId = params.alipay_no;
		var remark = params.remark;

		var headChar = "S";
		if(orderId){
			headChar = orderId.substring(0, 1);
		}
		if(headChar == "S"){
			orderModel.findOneAndUpdate({id: orderId}, {payStatus : 1}, null, function(err, doc){
				if(err){
					__logger.info("订单号:" + orderId + "支付失败:" + err);
					return;
				}
				__logger.info("订单号:" + orderId + "支付成功");
			})
		}else{
			var amount = params.amount;
			if(req.session.orders[orderId]){
				__logger.info("用户(" + req.session.customer.loginId + "),订单号:" + orderId + "重复提交充值异常");
				return;
			}else{
				//充值折扣
				var level = Math.floor(amount/5)	//赠送20%
				var balance = parseFloat(amount) + parseInt(level);

				customerModel.findOneAndUpdate({loginId: req.session.customer.loginId}, {$inc: {balance: balance, totalPay: amount}}, null, function(err, doc){
					if(err){
						__logger.info("用户(" + req.session.customer.loginId + "),订单号:" + orderId + "充值订单失败");
						return;
					}
					req.session.orders[orderId] = amount;
					__logger.info("用户(" + req.session.customer.loginId + "),订单号:" + orderId + "充值成功,支付金额(" + amount + "),充值金额(" + balance + ")");
				})
			}
		}
	})
	.on('refund_fastpay_by_platform_pwd_success', function(batch_no, success_num, result_details){})
	.on('create_partner_trade_by_buyer_wait_buyer_pay', function(out_trade_no, trade_no){})
	.on('create_partner_trade_by_buyer_wait_seller_send_goods', function(out_trade_no, trade_no){})
	.on('create_partner_trade_by_buyer_wait_buyer_confirm_goods', function(out_trade_no, trade_no){})
	.on('create_partner_trade_by_buyer_trade_finished', function(out_trade_no, trade_no){})
	.on('send_goods_confirm_by_platform_fail', function(error){res.send(error)})
	.on('send_goods_confirm_by_platform_success', function(out_trade_no, trade_no, xml){})
	.on('trade_create_by_buyer_wait_buyer_pay', function(out_trade_no, trade_no){})
	.on('trade_create_by_buyer_wait_seller_send_goods', function(out_trade_no, trade_no){})
	.on('trade_create_by_buyer_wait_buyer_confirm_goods', function(out_trade_no, trade_no){})
	.on('trade_create_by_buyer_trade_finished', function(out_trade_no, trade_no){});	

exports.entry = function(req, res){
	res.render("views/index");
}

exports.route = function(app) {
	alipay.route(app);
}
	
exports.create_direct_pay_by_user = function(req, res){
	var data = {
		out_trade_no:req.body.alipayId,
		subject:req.body.alipayName,
		total_fee:req.body.alipayAmount,
		body: req.body.alipayDesc,
		show_url:req.body.alipayItem
	 };

	alipay.create_direct_pay_by_user(data, res);
}

exports.refund_fastpay_by_platform_pwd =function(req, res){
	var data = {
		 refund_date:req.body.WIDrefund_date
		,batch_no:req.body.WIDbatch_no
		,batch_num:req.body.WIDbatch_num
		,detail_data: req.body.WIDdetail_data
	 };

	alipay.refund_fastpay_by_platform_pwd(data, res);
}

exports.create_partner_trade_by_buyer = function(req, res){
	 var data = {
		out_trade_no	: req.body.WIDout_trade_no,
		subject	: req.body.WIDsubject,
		price	: req.body.WIDprice,
		quantity	: req.body.WIDquantity,
		logistics_fee	: req.body.WIDlogistics_fee,
		logistics_type	: req.body.WIDlogistics_type,
		logistics_payment	: req.body.WIDlogistics_payment,
		body	: req.body.WIDbody,
		show_url	: req.body.WIDshow_url,
		receive_name	: req.body.WIDreceive_name,
		receive_address	: req.body.WIDreceive_address,
		receive_zip	: req.body.WIDreceive_zip,
		receive_phone	: req.body.WIDreceive_phone,
		receive_mobile	: req.body.WIDreceive_mobile
	 };

	alipay.create_partner_trade_by_buyer(data, res);
}

exports.send_goods_confirm_by_platform = function(req, res){
	var data = {
		 trade_no:req.body.WIDtrade_no
		,logistics_name:req.body.WIDlogistics_name
		,invoice_no:req.body.WIDinvoice_no
		,transport_type: req.body.WIDtransport_type
	 };

	alipay.send_goods_confirm_by_platform(data, res);
}

exports.create_direct_bankpay_by_user = function(req, res){
	var data = {
		 out_trade_no:req.body.WIDout_trade_no
		,subject:req.body.WIDsubject
		,total_fee:req.body.WIDtotal_fee
		,body: req.body.WIDbody
		,show_url:req.body.WIDshow_url
		,paymethod:'bankPay'
		,defaultbank:req.body.WIDdefaultbank
	 };

	alipay.create_direct_pay_by_user(data, res);
}

exports.trade_create_by_buyer = function(req, res){
	var data = {
		out_trade_no	: req.body.WIDout_trade_no,
		subject	: req.body.WIDsubject,
		price	: req.body.WIDprice,
		quantity	: req.body.WIDquantity,
		logistics_fee	: req.body.WIDlogistics_fee,
		logistics_type	: req.body.WIDlogistics_type,
		logistics_payment	: req.body.WIDlogistics_payment,
		body	: req.body.WIDbody,
		show_url	: req.body.WIDshow_url,
		receive_name	: req.body.WIDreceive_name,
		receive_address	: req.body.WIDreceive_address,
		receive_zip	: req.body.WIDreceive_zip,
		receive_phone	: req.body.WIDreceive_phone,
		receive_mobile	: req.body.WIDreceive_mobile
	 };

	alipay.trade_create_by_buyer(data, res);
}

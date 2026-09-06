from django.urls import path

from .views.admin_views import CreditLedgerAdminListView, CreditRechargeAdminListView, CreditWalletAdminListView
from .views.api_views import CreditCatalogView, CreditRechargeStatusView, CreditRechargeView, CreditSpendView, CreditTransferView, CreditWalletView

app_name = 'credits'

urlpatterns = [
	path('catalog/', CreditCatalogView.as_view(), name='catalog'),
	path('wallet/', CreditWalletView.as_view(), name='wallet'),
	path('recharge/', CreditRechargeView.as_view(), name='recharge'),
	path('recharge/<int:recharge_id>/', CreditRechargeStatusView.as_view(), name='recharge-status'),
	path('spend/', CreditSpendView.as_view(), name='spend'),
	path('transfer/', CreditTransferView.as_view(), name='transfer'),
	path('admin/wallets/', CreditWalletAdminListView.as_view(), name='admin-wallets'),
	path('admin/recharges/', CreditRechargeAdminListView.as_view(), name='admin-recharges'),
	path('admin/ledger/', CreditLedgerAdminListView.as_view(), name='admin-ledger'),
]

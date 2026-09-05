from django.urls import path

from .views.admin_views import CreditLedgerAdminListView, CreditRechargeAdminListView, CreditWalletAdminListView
from .views.api_views import CreditCatalogView, CreditRechargeView, CreditSpendView, CreditWalletView

app_name = 'credits'

urlpatterns = [
	path('catalog/', CreditCatalogView.as_view(), name='catalog'),
	path('wallet/', CreditWalletView.as_view(), name='wallet'),
	path('recharge/', CreditRechargeView.as_view(), name='recharge'),
	path('spend/', CreditSpendView.as_view(), name='spend'),
	path('admin/wallets/', CreditWalletAdminListView.as_view(), name='admin-wallets'),
	path('admin/recharges/', CreditRechargeAdminListView.as_view(), name='admin-recharges'),
	path('admin/ledger/', CreditLedgerAdminListView.as_view(), name='admin-ledger'),
]

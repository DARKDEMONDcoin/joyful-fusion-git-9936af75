INSERT INTO public.billing_skus (sku, kind, display_name, amount_egp, amount_usd, credits, active, sort_order)
VALUES ('course_lifetime', 'topup', 'كورس الشغل أونلاين — وصول مدى الحياة', 999.00, 20.00, 0, true, 5)
ON CONFLICT (sku) DO UPDATE
SET display_name = EXCLUDED.display_name,
    amount_egp = EXCLUDED.amount_egp,
    amount_usd = EXCLUDED.amount_usd,
    active = true;
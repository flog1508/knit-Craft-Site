-- =========================================================
-- Types ENUM nécessaires
-- =========================================================
create type customorder_status as enum ('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','REJECTED');
create type order_type        as enum ('EXACT','CUSTOM','BESPOKE');
create type order_status      as enum ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED');
create type payment_status    as enum ('PENDING','COMPLETED','FAILED','REFUNDED');
create type user_role         as enum ('ADMIN','CLIENT','GUEST');

-- =========================================================
-- Table: user  (mot réservé → guillemets)
-- =========================================================
create table public."user" (
  id             text primary key,
  name           text,
  email          text,
  "emailVerified" timestamptz,
  password       text,
  image          text,
  phone          text,
  role           user_role not null default 'CLIENT',
  "createdAt"    timestamptz not null default now(),
  "updatedAt"    timestamptz not null
);

create unique index user_email_key on public."user" (email);
create index user_email_idx on public."user" (email);
create index user_role_idx on public."user" (role);

-- =========================================================
-- Table: about
-- =========================================================
create table public.about (
  id            text primary key,
  title         text not null,
  subtitle      text,
  content       text not null,
  image         text,
  "updatedAt"   timestamptz not null,
  "extendedData" jsonb
);

-- =========================================================
-- Table: page
-- =========================================================
create table public.page (
  id          text primary key,
  slug        text not null,
  title       text not null,
  content     text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null,
  constraint page_slug_key unique (slug)
);

create index page_slug_idx on public.page (slug);

-- =========================================================
-- Table: product
-- =========================================================
create table public.product (
  id                 text primary key,
  name               text not null,
  slug               text not null,
  description        text not null,
  "longDescription"  text,
  image              text,
  images             jsonb not null,
  "basePrice"        double precision not null,
  "discountPercentage" integer not null default 0,
  stock              integer not null default 0,
  "isOutOfStock"     smallint not null default 0,
  category           text not null,
  tags               jsonb not null,
  "isCustomizable"   smallint not null default 0,
  "allowExact"       smallint not null default 1,
  "allowCustom"      smallint not null default 1,
  "allowBespoke"     smallint not null default 0,
  "createdAt"        timestamptz not null default now(),
  "updatedAt"        timestamptz not null,
  "deliveryDaysMax"  integer not null default 10,
  "deliveryDaysMin"  integer not null default 7,
  constraint product_slug_key unique (slug)
);

create index product_slug_idx on public.product (slug);
create index product_category_idx on public.product (category);
create index product_isOutOfStock_idx on public.product ("isOutOfStock");

-- =========================================================
-- Table: promotion
-- =========================================================
create table public.promotion (
  id                  text primary key,
  code                text not null,
  "discountPercentage" integer not null,
  description         text,
  "startDate"         timestamptz not null,
  "endDate"           timestamptz not null,
  "maxUses"           integer,
  "usedCount"         integer not null default 0,
  "isActive"          smallint not null default 1,
  "createdAt"         timestamptz not null default now(),
  "updatedAt"         timestamptz not null,
  constraint promotion_code_key unique (code)
);

create index promotion_code_idx on public.promotion (code);
create index promotion_isActive_idx on public.promotion ("isActive");

-- =========================================================
-- Table: customorder
-- =========================================================
create table public.customorder (
  id           text primary key,
  "userId"     text not null,
  email        text not null,
  description  text not null,
  requirements text not null,
  images       jsonb not null,
  budget       double precision,
  deadline     timestamptz,
  status       customorder_status not null default 'PENDING',
  "adminNotes" text,
  "createdAt"  timestamptz not null default now(),
  "updatedAt"  timestamptz not null
);

create index customorder_userId_idx on public.customorder ("userId");
create index customorder_status_idx on public.customorder (status);

alter table public.customorder
  add constraint customorder_userId_fkey
  foreign key ("userId") references public."user"(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: "order"  (mot réservé → guillemets)
-- =========================================================
create table public."order" (
  id              text primary key,
  "orderNumber"   text not null,
  "userId"        text not null,
  email           text not null,
  phone           text not null,
  "firstName"     text not null,
  "lastName"      text not null,
  address         text not null,
  city            text not null,
  "postalCode"    text not null,
  country         text not null,
  "totalPrice"    double precision not null,
  "orderType"     order_type not null default 'EXACT',
  "variantId"     text,
  "estimatedDays" integer,
  status          order_status not null default 'PENDING',
  "paymentStatus" payment_status not null default 'PENDING',
  "whatsappSent"  smallint not null default 0,
  "emailSent"     smallint not null default 0,
  "whatsappMessageId" text,
  notes           text,
  "createdAt"     timestamptz not null default now(),
  "updatedAt"     timestamptz not null,
  constraint order_orderNumber_key unique ("orderNumber")
);

create index order_userId_idx     on public."order" ("userId");
create index order_status_idx     on public."order" (status);
create index order_orderNumber_idx on public."order" ("orderNumber");
create index order_orderType_idx  on public."order" ("orderType");

alter table public."order"
  add constraint order_userId_fkey
  foreign key ("userId") references public."user"(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: session
-- =========================================================
create table public.session (
  id             text primary key,
  "sessionToken" text not null,
  "userId"       text not null,
  expires        timestamptz not null,
  constraint session_sessionToken_key unique ("sessionToken")
);

create index session_userId_idx on public.session ("userId");

alter table public.session
  add constraint session_userId_fkey
  foreign key ("userId") references public."user"(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: account
-- =========================================================
create table public.account (
  id                  text primary key,
  "userId"            text not null,
  type                text not null,
  provider            text not null,
  "providerAccountId" text not null,
  refresh_token       text,
  access_token        text,
  expires_at          integer,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  constraint account_provider_providerAccountId_key
    unique (provider, "providerAccountId")
);

create index account_userId_idx on public.account ("userId");

alter table public.account
  add constraint account_userId_fkey
  foreign key ("userId") references public."user"(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: cart
-- =========================================================
create table public.cart (
  id          text primary key,
  "userId"    text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null
);

create unique index cart_userId_key on public.cart ("userId");
create index cart_userId_idx       on public.cart ("userId");

alter table public.cart
  add constraint cart_userId_fkey
  foreign key ("userId") references public."user"(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: cartitem
-- =========================================================
create table public.cartitem (
  id          text primary key,
  "cartId"    text not null,
  "productId" text not null,
  quantity    integer not null
);

create index cartitem_cartId_idx    on public.cartitem ("cartId");
create index cartitem_productId_idx on public.cartitem ("productId");

alter table public.cartitem
  add constraint cartitem_cartId_fkey
  foreign key ("cartId") references public.cart(id)
  on delete cascade on update cascade;

alter table public.cartitem
  add constraint cartitem_productId_fkey
  foreign key ("productId") references public.product(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: customizationoption
-- =========================================================
create table public.customizationoption (
  id           text primary key,
  "cartItemId" text not null,
  "optionName" text not null,
  "optionValue" text not null
);

create index customizationoption_cartItemId_idx
  on public.customizationoption ("cartItemId");

alter table public.customizationoption
  add constraint customizationoption_cartItemId_fkey
  foreign key ("cartItemId") references public.cartitem(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: customoption
-- =========================================================
create table public.customoption (
  id          text primary key,
  "productId" text not null,
  name        text not null,
  type        text not null,
  values      jsonb not null,
  "isRequired" smallint not null default 1
);

create index customoption_productId_idx
  on public.customoption ("productId");

alter table public.customoption
  add constraint customoption_productId_fkey
  foreign key ("productId") references public.product(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: productvariant
-- =========================================================
create table public.productvariant (
  id              text primary key,
  "productId"     text not null,
  name            text not null,
  "daysMin"       integer not null,
  "daysMax"       integer not null,
  "priceMultiplier" double precision not null default 1,
  description     text,
  "createdAt"     timestamptz not null default now()
);

create index productvariant_productId_idx
  on public.productvariant ("productId");

alter table public.productvariant
  add constraint productvariant_productId_fkey
  foreign key ("productId") references public.product(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: orderitem
-- =========================================================
create table public.orderitem (
  id          text primary key,
  "orderId"   text not null,
  "productId" text not null,
  quantity    integer not null,
  price       double precision not null
);

create index orderitem_orderId_idx   on public.orderitem ("orderId");
create index orderitem_productId_idx on public.orderitem ("productId");

alter table public.orderitem
  add constraint orderitem_orderId_fkey
  foreign key ("orderId") references public."order"(id)
  on delete cascade on update cascade;

alter table public.orderitem
  add constraint orderitem_productId_fkey
  foreign key ("productId") references public.product(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: ordercustomization
-- =========================================================
create table public.ordercustomization (
  id           text primary key,
  "orderItemId" text not null,
  "optionName"  text not null,
  "optionValue" text not null
);

create index ordercustomization_orderItemId_idx
  on public.ordercustomization ("orderItemId");

alter table public.ordercustomization
  add constraint ordercustomization_orderItemId_fkey
  foreign key ("orderItemId") references public.orderitem(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: contactmessage
-- =========================================================
create table public.contactmessage (
  id          text primary key,
  name        text not null,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,
  "isRead"    smallint not null default 0,
  response    text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null
);

create index contactmessage_isRead_idx    on public.contactmessage ("isRead");
create index contactmessage_createdAt_idx on public.contactmessage ("createdAt");

-- =========================================================
-- Table: review
-- =========================================================
create table public.review (
  id          text primary key,
  "productId" text,
  "userId"    text not null,
  rating      integer not null,
  comment     text not null,
  "isVerified" smallint not null default 0,
  helpful     integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null,
  image       text,
  video       text
);

create index review_productId_idx on public.review ("productId");
create index review_userId_idx    on public.review ("userId");
create index review_rating_idx    on public.review (rating);

alter table public.review
  add constraint review_productId_fkey
  foreign key ("productId") references public.product(id)
  on delete cascade on update cascade;

alter table public.review
  add constraint review_userId_fkey
  foreign key ("userId") references public."user"(id)
  on delete cascade on update cascade;

-- =========================================================
-- Table: verificationtoken
-- =========================================================
create table public.verificationtoken (
  identifier text not null,
  token      text not null,
  expires    timestamptz not null,
  constraint verificationtoken_token_key unique (token),
  constraint verificationtoken_identifier_token_key unique (identifier, token)
);